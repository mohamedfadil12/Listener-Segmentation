import { ListenerSegment, SegmentInfo, PresetArchetype } from "../types";

export const SEGMENT_DETAILS: Record<ListenerSegment, SegmentInfo> = {
  "Casual Listener": {
    name: "Casual Listener",
    subtitle: "The Serene Orbit",
    orbitName: "Outer Drift Orbit",
    orbitBrightness: "Dim Orbit",
    description:
      "Listens intentionally during short windows—daily commutes, chores, or evening wind-downs. Relies on algorithmic radio or trusted comfort albums with very few skips.",
    keyBehaviors: [
      "Low weekly listening hours (under 10 hrs/week)",
      "High song completion rate (< 20% skips)",
      "Keeps a small, trusted library of 3-6 core playlists",
      "Listens passively without aggressive curation"
    ],
    recommendedHabits: [
      "Weekly Discovery playlists to gently broaden repertoire",
      "Short curated podcasts or mood mixes for commutes",
      "Lossless audio playback for higher fidelity during relaxed listening"
    ],
    streamingProfile: "Steady, intentional, low churn, high affinity for familiar comfort tracks.",
    icon: "Moon",
    color: "#94A3B8",
    glowColor: "rgba(148, 163, 184, 0.4)"
  },
  "Music Explorer": {
    name: "Music Explorer",
    subtitle: "The Constellation Weaver",
    orbitName: "Harmonic Discovery Orbit",
    orbitBrightness: "Resonant Orbit",
    description:
      "A musical archeologist driven by curiosity. Constantly discovering new underground genres, creating niche playlists, and rapidly sampling tracks with high skip tolerance.",
    keyBehaviors: [
      "Extensive custom playlist catalog (18–35+ playlists)",
      "High skip rate (45%–70%) while sampling new releases",
      "Cross-genre exploration spanning international and indie niches",
      "Early adopter of emerging artist releases and deep cuts"
    ],
    recommendedHabits: [
      "Deep catalog radio stations & niche label exploration",
      "Bespoke playlist folders organized by micro-moods & tempos",
      "Collaborative playlist jamming with fellow curators"
    ],
    streamingProfile: "High curation velocity, diverse genre vectors, dynamic playlist architecture.",
    icon: "Compass",
    color: "#F2B85C",
    glowColor: "rgba(242, 184, 92, 0.6)"
  },
  "Heavy Listener": {
    name: "Heavy Listener",
    subtitle: "The Pulsar Streamer",
    orbitName: "Luminous Core Orbit",
    orbitBrightness: "Luminous Orbit",
    description:
      "Music is the soundtrack to every waking hour—work, study, gaming, workouts, and travel. Consistently clocks extensive hours with massive daily song throughput.",
    keyBehaviors: [
      "Supercharged listening time (25–40+ hrs/week)",
      "High song volume (> 80–120+ tracks/day)",
      "Deep focus listening during productivity sessions",
      "Very high overall streaming consumption & loyalty"
    ],
    recommendedHabits: [
      "Binaural beats, ambient soundscapes, & lo-fi focus playlists",
      "Smart queue management for marathon listening sessions",
      "Dedicated listening devices and high-end ANC headphones"
    ],
    streamingProfile: "Maximum engagement, constant streaming stream-flow, backbone power user.",
    icon: "Sun",
    color: "#FBBF24",
    glowColor: "rgba(251, 191, 36, 0.7)"
  }
};

export const PRESET_ARCHETYPES: PresetArchetype[] = [
  {
    id: "commuter",
    name: "The Commute Companion",
    tagline: "Short focused daily trips, minimal skipping",
    badge: "Low Hours • High Retention",
    segment: "Casual Listener",
    values: {
      listeningHours: 5,
      songsPerDay: 12,
      skipRate: 15,
      playlistCount: 4
    }
  },
  {
    id: "crate-digger",
    name: "The Crate Digger",
    tagline: "Endless genre hopping, 25+ specific mood playlists",
    badge: "High Curation • High Skips",
    segment: "Music Explorer",
    values: {
      listeningHours: 16,
      songsPerDay: 45,
      skipRate: 62,
      playlistCount: 26
    }
  },
  {
    id: "all-day-streamer",
    name: "The Continuous Streamer",
    tagline: "Soundtrack for coding, gaming, and sleep all week",
    badge: "Maximum Hours • Power User",
    segment: "Heavy Listener",
    values: {
      listeningHours: 32,
      songsPerDay: 105,
      skipRate: 22,
      playlistCount: 15
    }
  },
  {
    id: "passive-bgm",
    name: "The Weekend Lounger",
    tagline: "Sunday morning jazz and evening vinyl vibes",
    badge: "Gentle Pace • Low Skips",
    segment: "Casual Listener",
    values: {
      listeningHours: 7,
      songsPerDay: 18,
      skipRate: 10,
      playlistCount: 3
    }
  },
  {
    id: "curator-dj",
    name: "The Scene Tastemaker",
    tagline: "Tracks new Friday drops and building underground mixes",
    badge: "High Discovery • Dynamic Mix",
    segment: "Music Explorer",
    values: {
      listeningHours: 20,
      songsPerDay: 58,
      skipRate: 50,
      playlistCount: 32
    }
  }
];

export const FEATURE_INFO = [
  {
    id: "listeningHours",
    label: "Listening Time",
    unit: "hrs/wk",
    min: 0,
    max: 40,
    step: 1,
    description: "Total weekly hours streaming music or podcasts",
    icon: "Clock"
  },
  {
    id: "songsPerDay",
    label: "Daily Song Volume",
    unit: "songs/day",
    min: 0,
    max: 150,
    step: 1,
    description: "Average count of tracks played each day",
    icon: "Music"
  },
  {
    id: "skipRate",
    label: "Skip Frequency",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
    description: "Percentage of songs skipped before 30 seconds",
    icon: "FastForward"
  },
  {
    id: "playlistCount",
    label: "Playlist Catalog",
    unit: "playlists",
    min: 0,
    max: 40,
    step: 1,
    description: "Number of custom curated or saved playlists in library",
    icon: "ListMusic"
  }
];
