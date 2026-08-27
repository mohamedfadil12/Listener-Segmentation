export interface ModelParams {
  mean: [number, number, number, number];
  scale: [number, number, number, number];
  centers: [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
  ];
  labelOrder: Record<string, string>;
}

export type ListenerSegment = "Casual Listener" | "Music Explorer" | "Heavy Listener";

export interface ListenerInputs {
  listeningHours: number; // 0 - 40 hrs/week
  songsPerDay: number;    // 0 - 150 songs/day
  skipRate: number;       // 0 - 100 %
  playlistCount: number;  // 0 - 40 playlists
}

export interface PredictionResult {
  clusterIndex: number;
  segmentName: ListenerSegment;
  distances: [number, number, number];
  scaledInputs: [number, number, number, number];
  confidence: number;
  unscaledCenters: [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
  ];
}

export interface SegmentInfo {
  name: ListenerSegment;
  subtitle: string;
  orbitName: string;
  orbitBrightness: "Dim Orbit" | "Resonant Orbit" | "Luminous Orbit";
  description: string;
  keyBehaviors: string[];
  recommendedHabits: string[];
  streamingProfile: string;
  icon: string;
  color: string;
  glowColor: string;
}

export interface PresetArchetype {
  id: string;
  name: string;
  tagline: string;
  values: ListenerInputs;
  segment: ListenerSegment;
  badge: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatarId: string;
  avatarIcon: string;
  primaryService: "Spotify" | "Apple Music" | "YouTube Music" | "Tidal" | "Last.fm" | "Local / Vinyl";
  bio: string;
  favoriteGenres: string[];
  topArtists: string[];
  joinedDate: string;
}

export type HistorySource =
  | "Manual Telemetry"
  | "Spotify Import"
  | "Apple Music Import"
  | "YouTube Music"
  | "Last.fm Sync"
  | "Custom File Import"
  | "Archetype Preset"
  | "Simulation";

export interface HistorySnapshot {
  id: string;
  timestamp: string; // ISO date or formatted
  title: string;
  note?: string;
  source: HistorySource;
  inputs: ListenerInputs;
  prediction: PredictionResult;
  stats?: {
    totalTracksAnalyzed?: number;
    samplePeriod?: string;
    dominantVibe?: string;
  };
}

export interface ImportedTrackRecord {
  trackName: string;
  artistName: string;
  albumName?: string;
  msPlayed: number;
  skipped: boolean;
  timestamp?: string;
}

export interface StreamingImportAnalysis {
  sourceName: string;
  totalTracks: number;
  totalHours: number;
  estimatedWeeklyHours: number;
  songsPerDay: number;
  skipRate: number;
  estimatedPlaylistCount: number;
  dateRange: { start: string; end: string };
  topArtists: { name: string; count: number; percentage: number }[];
  topTracks: { name: string; artist: string; count: number }[];
  inferredSegment: ListenerSegment;
  rawInputs: ListenerInputs;
}

