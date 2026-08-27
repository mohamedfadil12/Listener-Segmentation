import { ListenerInputs, StreamingImportAnalysis, ImportedTrackRecord } from "../types";
import { predict } from "./predict";

export interface SampleDataset {
  id: string;
  name: string;
  service: "Spotify" | "Apple Music" | "Last.fm" | "YouTube Music";
  description: string;
  tracksCount: number;
  expectedSegment: string;
  generateData: () => ImportedTrackRecord[];
}

/**
 * Parses raw text from JSON or CSV files into normalized ImportedTrackRecord[]
 */
export function parseImportedFile(fileName: string, content: string): ImportedTrackRecord[] {
  const isJson = fileName.toLowerCase().endsWith(".json") || content.trim().startsWith("[") || content.trim().startsWith("{");

  if (isJson) {
    return parseJsonHistory(content);
  } else {
    return parseCsvHistory(content);
  }
}

/**
 * Parses Spotify Takeout JSON / Generic JSON
 */
function parseJsonHistory(jsonStr: string): ImportedTrackRecord[] {
  try {
    const raw = JSON.parse(jsonStr);
    const items = Array.isArray(raw) ? raw : (raw.items || raw.tracks || raw.history || [raw]);

    return items.map((item: any) => {
      // Handle Spotify endsong format vs Spotify StreamingHistory format vs generic
      const trackName =
        item.master_metadata_track_name ||
        item.trackName ||
        item.track_name ||
        item.title ||
        item.name ||
        "Unknown Track";

      const artistName =
        item.master_metadata_album_artist_name ||
        item.artistName ||
        item.artist_name ||
        item.artist ||
        "Unknown Artist";

      const albumName =
        item.master_metadata_album_album_name ||
        item.albumName ||
        item.album_name ||
        item.album ||
        undefined;

      const msPlayed =
        typeof item.ms_played === "number"
          ? item.ms_played
          : typeof item.msPlayed === "number"
          ? item.msPlayed
          : typeof item.duration_ms === "number"
          ? item.duration_ms
          : (typeof item.duration_seconds === "number" ? item.duration_seconds * 1000 : 180000);

      // Skipped heuristics: Spotify flag or played less than 30 seconds
      const skipped =
        item.skipped === true ||
        item.reason_end === "fwdbtn" ||
        item.end_type === "skip" ||
        (msPlayed > 0 && msPlayed < 30000);

      const timestamp = item.ts || item.endTime || item.timestamp || item.date || new Date().toISOString();

      return {
        trackName,
        artistName,
        albumName,
        msPlayed,
        skipped,
        timestamp
      };
    });
  } catch (err) {
    console.error("Error parsing JSON streaming history:", err);
    throw new Error("Invalid JSON format. Please ensure the file contains valid listening records.");
  }
}

/**
 * Parses Apple Music / Last.fm / Generic CSV
 */
function parseCsvHistory(csvStr: string): ImportedTrackRecord[] {
  const lines = csvStr.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) {
    throw new Error("CSV file appears to be empty or has no data rows.");
  }

  const headerLine = lines[0].toLowerCase();
  const headers = parseCsvLine(headerLine);

  const trackIdx = headers.findIndex((h) => h.includes("track") || h.includes("title") || h.includes("song") || h.includes("description"));
  const artistIdx = headers.findIndex((h) => h.includes("artist"));
  const albumIdx = headers.findIndex((h) => h.includes("album"));
  const msIdx = headers.findIndex((h) => h.includes("duration") || h.includes("ms") || h.includes("milliseconds") || h.includes("play duration"));
  const endReasonIdx = headers.findIndex((h) => h.includes("end reason") || h.includes("skip") || h.includes("reason"));
  const timeIdx = headers.findIndex((h) => h.includes("time") || h.includes("date") || h.includes("event start"));

  const records: ImportedTrackRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);
    if (!row || row.length === 0) continue;

    const trackName = trackIdx !== -1 && row[trackIdx] ? row[trackIdx] : `Track #${i}`;
    const artistIdxFound = artistIdx !== -1 && row[artistIdx] ? row[artistIdx] : "Unknown Artist";
    const albumName = albumIdx !== -1 && row[albumIdx] ? row[albumIdx] : undefined;

    let msPlayed = 180000;
    if (msIdx !== -1 && row[msIdx]) {
      const parsedNum = parseFloat(row[msIdx]);
      if (!isNaN(parsedNum)) {
        msPlayed = parsedNum < 1000 ? parsedNum * 1000 : parsedNum;
      }
    }

    let skipped = msPlayed < 30000;
    if (endReasonIdx !== -1 && row[endReasonIdx]) {
      const reason = row[endReasonIdx].toLowerCase();
      if (reason.includes("skip") || reason.includes("fwd") || reason.includes("manual_skip") || reason.includes("true") || reason.includes("1")) {
        skipped = true;
      }
    }

    const timestamp = timeIdx !== -1 && row[timeIdx] ? row[timeIdx] : new Date().toISOString();

    records.push({
      trackName,
      artistName: artistIdxFound,
      albumName,
      msPlayed,
      skipped,
      timestamp
    });
  }

  return records;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(cur.trim().replace(/^["']|["']$/g, ""));
      cur = "";
    } else {
      cur += char;
    }
  }
  result.push(cur.trim().replace(/^["']|["']$/g, ""));
  return result;
}

/**
 * Analyzes imported records into aggregated behavioral telemetry metrics for K-Means
 */
export function analyzeStreamingRecords(
  serviceName: string,
  records: ImportedTrackRecord[]
): StreamingImportAnalysis {
  if (!records || records.length === 0) {
    throw new Error("No valid track listening logs found to analyze.");
  }

  let totalMs = 0;
  let skippedCount = 0;
  const artistCounts: Record<string, number> = {};
  const trackCounts: Record<string, { artist: string; count: number }> = {};
  const albumSet = new Set<string>();
  const dates: number[] = [];

  for (const rec of records) {
    totalMs += rec.msPlayed;
    if (rec.skipped) skippedCount++;

    if (rec.artistName) {
      artistCounts[rec.artistName] = (artistCounts[rec.artistName] || 0) + 1;
    }
    if (rec.trackName) {
      const key = `${rec.trackName} - ${rec.artistName}`;
      if (!trackCounts[key]) {
        trackCounts[key] = { artist: rec.artistName, count: 0 };
      }
      trackCounts[key].count += 1;
    }
    if (rec.albumName) {
      albumSet.add(rec.albumName);
    }
    if (rec.timestamp) {
      const parsed = Date.parse(rec.timestamp);
      if (!isNaN(parsed)) {
        dates.push(parsed);
      }
    }
  }

  const totalHours = Math.round((totalMs / (1000 * 60 * 60)) * 10) / 10;
  const skipRate = Math.min(100, Math.max(0, Math.round((skippedCount / records.length) * 100)));

  // Estimate time span
  let daysSpan = 30; // default 30-day window
  let startDateStr = "Last 30 Days";
  let endDateStr = "Present";

  if (dates.length >= 2) {
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const diffDays = Math.max(1, Math.round((maxDate - minDate) / (1000 * 60 * 60 * 24)));
    daysSpan = diffDays;
    startDateStr = new Date(minDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    endDateStr = new Date(maxDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  // Estimated weekly hours
  const weeksSpan = Math.max(0.5, daysSpan / 7);
  const rawWeeklyHours = totalHours / weeksSpan;
  const estimatedWeeklyHours = Math.min(40, Math.max(1, Math.round(rawWeeklyHours)));

  // Songs per day
  const rawSongsPerDay = records.length / Math.max(1, daysSpan);
  const songsPerDay = Math.min(150, Math.max(1, Math.round(rawSongsPerDay)));

  // Estimated playlist count based on artist diversity & album spread
  const uniqueArtists = Object.keys(artistCounts).length;
  const uniqueAlbums = albumSet.size || Math.round(uniqueArtists * 1.4);
  const estimatedPlaylistCount = Math.min(
    40,
    Math.max(2, Math.round((uniqueArtists / records.length) * 35 + (uniqueAlbums > 20 ? 10 : 3)))
  );

  // Top Artists
  const topArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / records.length) * 100)
    }));

  // Top Tracks
  const topTracks = Object.entries(trackCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([titleAndArtist, data]) => {
      const title = titleAndArtist.split(" - ")[0] || titleAndArtist;
      return {
        name: title,
        artist: data.artist,
        count: data.count
      };
    });

  const rawInputs: ListenerInputs = {
    listeningHours: estimatedWeeklyHours,
    songsPerDay,
    skipRate,
    playlistCount: estimatedPlaylistCount
  };

  const prediction = predict(rawInputs);

  return {
    sourceName: serviceName,
    totalTracks: records.length,
    totalHours,
    estimatedWeeklyHours,
    songsPerDay,
    skipRate,
    estimatedPlaylistCount,
    dateRange: { start: startDateStr, end: endDateStr },
    topArtists,
    topTracks,
    inferredSegment: prediction.segmentName,
    rawInputs
  };
}

/**
 * Pre-built sample datasets ready for 1-click test import
 */
export const SAMPLE_STREAMING_DATASETS: SampleDataset[] = [
  {
    id: "spotify-explorer",
    name: "Spotify Discovery & Indie Archaeology",
    service: "Spotify",
    description: "High skip rate, constantly exploring curated weekly discovery playlists and finding emerging artists.",
    tracksCount: 1420,
    expectedSegment: "Music Explorer",
    generateData: () => generateMockStreamRecords({
      artists: ["Beach House", "Phoebe Bridgers", "Khruangbin", "Four Tet", "Kaytranada", "Japanese Breakfast", "Alvvays", "Caribou"],
      skipChance: 0.62,
      avgMinutes: 3.1,
      totalCount: 1420,
      days: 90,
      uniqueAlbumsRatio: 0.45
    })
  },
  {
    id: "spotify-heavy",
    name: "Spotify Cyberpunk & Synthwave Marathon",
    service: "Spotify",
    description: "Daily nonstop background audio, high volume, low skip rate, immersive workflow backdrop.",
    tracksCount: 3150,
    expectedSegment: "Heavy Listener",
    generateData: () => generateMockStreamRecords({
      artists: ["Carpenter Brut", "Gunship", "The Midnight", "Daft Punk", "Lorn", "Kavinsky", "Tycho", "Justice"],
      skipChance: 0.16,
      avgMinutes: 3.8,
      totalCount: 3150,
      days: 90,
      uniqueAlbumsRatio: 0.18
    })
  },
  {
    id: "apple-casual",
    name: "Apple Music Acoustic & Morning Jazz",
    service: "Apple Music",
    description: "Intentional morning coffee listening, acoustic albums on repeat, ultra-low skip rate.",
    tracksCount: 380,
    expectedSegment: "Casual Listener",
    generateData: () => generateMockStreamRecords({
      artists: ["Bill Evans", "Norah Jones", "Bon Iver", "Nick Drake", "Sufjan Stevens", "Miles Davis"],
      skipChance: 0.12,
      avgMinutes: 4.2,
      totalCount: 380,
      days: 60,
      uniqueAlbumsRatio: 0.12
    })
  },
  {
    id: "lastfm-club",
    name: "Last.fm Scrobble Archive (Hyperpop & Club)",
    service: "Last.fm",
    description: "Fast-paced clubbing tracks, DJ mixes, medium skip rate, extensive track libraries.",
    tracksCount: 2200,
    expectedSegment: "Heavy Listener",
    generateData: () => generateMockStreamRecords({
      artists: ["Charli xcx", "Fred again..", "Bicep", "Overmono", "Peggy Gou", "Disclosure", "SOPHIE"],
      skipChance: 0.38,
      avgMinutes: 2.9,
      totalCount: 2200,
      days: 75,
      uniqueAlbumsRatio: 0.3
    })
  }
];

function generateMockStreamRecords(config: {
  artists: string[];
  skipChance: number;
  avgMinutes: number;
  totalCount: number;
  days: number;
  uniqueAlbumsRatio: number;
}): ImportedTrackRecord[] {
  const records: ImportedTrackRecord[] = [];
  const now = Date.now();
  const msPerDay = 1000 * 60 * 60 * 24;

  const trackTitles: Record<string, string[]> = {
    "Beach House": ["Space Song", "Myth", "Silver Soul", "Levitation", "Sparks"],
    "Phoebe Bridgers": ["Kyoto", "Motion Sickness", "Garden Song", "I Know The End"],
    "Khruangbin": ["Texas Sun", "Time (You and I)", "So We Won't Forget", "White Gloves"],
    "Four Tet": ["Baby", "Two Thousand and Seventeen", "Teenage Birdsong", "Looking at Your Pager"],
    "Carpenter Brut": ["Turbo Killer", "Roller Mobster", "Le Perv", "Maniac"],
    "The Midnight": ["Sunset", "Los Angeles", "Vampires", "Days of Thunder"],
    "Gunship": ["Tech Noir", "Fly For Your Life", "Dark All Day", "When You Grow Up"],
    "Bill Evans": ["Peace Piece", "Waltz for Debby", "My Foolish Heart", "Autumn Leaves"],
    "Bon Iver": ["Holocene", "Skinny Love", "Re: Stacks", "Blood Bank"],
    "Charli xcx": ["360", "Von dutch", "Apple", "Track 10", "Vroom Vroom"],
    "Fred again..": ["Delilah (pull me out of this)", "Danielle (smile on my face)", "Marea (we’ve lost dancing)"],
    "Daft Punk": ["Get Lucky", "Harder Better Faster Stronger", "One More Time", "Instant Crush"]
  };

  for (let i = 0; i < config.totalCount; i++) {
    const artist = config.artists[i % config.artists.length];
    const titles = trackTitles[artist] || ["Echoes of Light", "Celestial Waves", "Midnight Drift", "Lunar Phase"];
    const title = titles[i % titles.length];
    const isSkipped = Math.random() < config.skipChance;
    const durationMs = isSkipped
      ? Math.floor(Math.random() * 25000 + 4000)
      : Math.floor((config.avgMinutes * 60 + (Math.random() * 60 - 30)) * 1000);

    const randomDayOffset = Math.random() * config.days;
    const timestamp = new Date(now - randomDayOffset * msPerDay).toISOString();

    records.push({
      trackName: title,
      artistName: artist,
      albumName: `${artist} - Collection Vol. ${(i % 5) + 1}`,
      msPlayed: durationMs,
      skipped: isSkipped,
      timestamp
    });
  }

  return records;
}
