import { UserProfile, HistorySnapshot, ListenerInputs } from "../types";
import { predict } from "./predict";

const PROFILE_STORAGE_KEY = "listener_segment_profile_v1";
const HISTORY_STORAGE_KEY = "listener_segment_history_v1";

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Astral Seeker",
  handle: "@orbit_listener",
  avatarId: "pulsar",
  avatarIcon: "Sparkles",
  primaryService: "Spotify",
  bio: "Audiophile wandering through ambient drone, synthwave, and midnight jazz frequencies.",
  favoriteGenres: ["Synthwave", "Dream Pop", "Ambient", "Jazz Fusion"],
  topArtists: ["The Midnight", "Beach House", "Khruangbin", "Four Tet"],
  joinedDate: "2024"
};

export const INITIAL_HISTORY_SNAPSHOTS: HistorySnapshot[] = [
  {
    id: "hist-001",
    timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Initial Calibration Test",
    note: "Quiet weekend acoustic listening sessions at home.",
    source: "Manual Telemetry",
    inputs: {
      listeningHours: 8,
      songsPerDay: 18,
      skipRate: 15,
      playlistCount: 6
    },
    prediction: predict({
      listeningHours: 8,
      songsPerDay: 18,
      skipRate: 15,
      playlistCount: 6
    }),
    stats: {
      totalTracksAnalyzed: 126,
      samplePeriod: "Jul 2024",
      dominantVibe: "Acoustic / Intimate"
    }
  },
  {
    id: "hist-002",
    timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Deep Discovery Exploration",
    note: "Digging through experimental electronic release radar playlists.",
    source: "Spotify Import",
    inputs: {
      listeningHours: 15,
      songsPerDay: 48,
      skipRate: 64,
      playlistCount: 26
    },
    prediction: predict({
      listeningHours: 15,
      songsPerDay: 48,
      skipRate: 64,
      playlistCount: 26
    }),
    stats: {
      totalTracksAnalyzed: 940,
      samplePeriod: "Aug 2024",
      dominantVibe: "Curious / Eclectic"
    }
  },
  {
    id: "hist-003",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    title: "Late Night Project Marathon",
    note: "Continuous synthwave backdrop while building web applications.",
    source: "Apple Music Import",
    inputs: {
      listeningHours: 29,
      songsPerDay: 95,
      skipRate: 22,
      playlistCount: 16
    },
    prediction: predict({
      listeningHours: 29,
      songsPerDay: 95,
      skipRate: 22,
      playlistCount: 16
    }),
    stats: {
      totalTracksAnalyzed: 1850,
      samplePeriod: "Aug 2024",
      dominantVibe: "Hyper-Focused / Heavy"
    }
  }
];

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    return { ...DEFAULT_USER_PROFILE, ...JSON.parse(raw) };
  } catch (e) {
    console.error("Failed to load user profile:", e);
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save user profile:", e);
  }
}

export function loadHistorySnapshots(): HistorySnapshot[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      // Seed with initial history if first time
      saveHistorySnapshots(INITIAL_HISTORY_SNAPSHOTS);
      return INITIAL_HISTORY_SNAPSHOTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_HISTORY_SNAPSHOTS;
    }
    return parsed;
  } catch (e) {
    console.error("Failed to load history snapshots:", e);
    return INITIAL_HISTORY_SNAPSHOTS;
  }
}

export function saveHistorySnapshots(snapshots: HistorySnapshot[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(snapshots));
  } catch (e) {
    console.error("Failed to save history snapshots:", e);
  }
}

export function addHistorySnapshot(
  inputs: ListenerInputs,
  title?: string,
  source: HistorySnapshot["source"] = "Manual Telemetry",
  note?: string,
  stats?: HistorySnapshot["stats"]
): HistorySnapshot {
  const prediction = predict(inputs);
  const newSnapshot: HistorySnapshot = {
    id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    title: title || `${prediction.segmentName} Snapshot`,
    source,
    note: note || `Captured at ${inputs.listeningHours} hrs/wk, ${inputs.songsPerDay} songs/day.`,
    inputs: { ...inputs },
    prediction,
    stats
  };

  const existing = loadHistorySnapshots();
  const updated = [newSnapshot, ...existing];
  saveHistorySnapshots(updated);
  return newSnapshot;
}

export function deleteHistorySnapshot(id: string): HistorySnapshot[] {
  const existing = loadHistorySnapshots();
  const filtered = existing.filter((s) => s.id !== id);
  saveHistorySnapshots(filtered);
  return filtered;
}

export function clearAllHistory(): HistorySnapshot[] {
  saveHistorySnapshots([]);
  return [];
}
