import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Starfield } from "./components/Starfield";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Console } from "./components/Console";
import { CelestialOrbitChart } from "./components/CelestialOrbitChart";
import { FeatureRadar } from "./components/FeatureRadar";
import { ArchetypePresets } from "./components/ArchetypePresets";
import { HistorySection } from "./components/HistorySection";
import { ProfileModal } from "./components/ProfileModal";
import { StreamingImportModal } from "./components/StreamingImportModal";
import { ModelDetailsModal } from "./components/ModelDetailsModal";
import { Footer } from "./components/Footer";
import { ListenerInputs, ListenerSegment, UserProfile, HistorySnapshot, StreamingImportAnalysis } from "./types";
import { predict } from "./lib/predict";
import { PRESET_ARCHETYPES } from "./data/archetypes";
import {
  loadUserProfile,
  saveUserProfile,
  loadHistorySnapshots,
  addHistorySnapshot,
  deleteHistorySnapshot,
  clearAllHistory,
  DEFAULT_USER_PROFILE
} from "./lib/storage";

const DEFAULT_INPUTS: ListenerInputs = {
  listeningHours: 16,
  songsPerDay: 42,
  skipRate: 54,
  playlistCount: 22
};

export default function App() {
  const [inputs, setInputs] = useState<ListenerInputs>(DEFAULT_INPUTS);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [history, setHistory] = useState<HistorySnapshot[]>([]);
  const [isModelModalOpen, setIsModelModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Initialize persistence from localStorage
  useEffect(() => {
    setUserProfile(loadUserProfile());
    setHistory(loadHistorySnapshots());
  }, []);

  // Real-time client-side ML prediction with zero network latency
  const prediction = useMemo(() => {
    return predict(inputs);
  }, [inputs]);

  const handleInputChange = useCallback((key: keyof ListenerInputs, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleReset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  const handleRandomize = useCallback(() => {
    setInputs({
      listeningHours: Math.floor(Math.random() * 41),
      songsPerDay: Math.floor(Math.random() * 151),
      skipRate: Math.floor(Math.random() * 101),
      playlistCount: Math.floor(Math.random() * 41)
    });
  }, []);

  const handleSelectPreset = useCallback((presetValues: ListenerInputs) => {
    setInputs(presetValues);
  }, []);

  const handleSelectSegmentPreset = useCallback((segmentName: string) => {
    const matchingPreset = PRESET_ARCHETYPES.find((p) => p.segment === segmentName);
    if (matchingPreset) {
      setInputs(matchingPreset.values);
    }
  }, []);

  const scrollToConsole = useCallback(() => {
    const el = document.getElementById("console-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Profile update handler
  const handleSaveProfile = useCallback((newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveUserProfile(newProfile);
  }, []);

  // History handlers
  const handleSaveCurrentSnapshot = useCallback((title?: string, note?: string) => {
    const created = addHistorySnapshot(inputs, title, "Manual Telemetry", note);
    setHistory((prev) => [created, ...prev]);
  }, [inputs]);

  const handleLoadSnapshot = useCallback((snapshot: HistorySnapshot) => {
    setInputs(snapshot.inputs);
    scrollToConsole();
  }, [scrollToConsole]);

  const handleDeleteSnapshot = useCallback((id: string) => {
    const updated = deleteHistorySnapshot(id);
    setHistory(updated);
  }, []);

  const handleClearHistory = useCallback(() => {
    const updated = clearAllHistory();
    setHistory(updated);
  }, []);

  // Streaming Analysis Apply Handler
  const handleApplyStreamingAnalysis = useCallback((analysis: StreamingImportAnalysis) => {
    // 1. Set telemetry inputs
    setInputs(analysis.rawInputs);

    // 2. Add to history snapshots
    const topArtistText = analysis.topArtists.length > 0 ? `Top: ${analysis.topArtists.map(a => a.name).join(", ")}.` : "";
    const snapshot = addHistorySnapshot(
      analysis.rawInputs,
      `${analysis.sourceName} Sync`,
      analysis.sourceName.toLowerCase().includes("spotify") ? "Spotify Import" :
      analysis.sourceName.toLowerCase().includes("apple") ? "Apple Music Import" : "Custom File Import",
      `Period: ${analysis.dateRange.start} - ${analysis.dateRange.end}. ${topArtistText}`,
      {
        totalTracksAnalyzed: analysis.totalTracks,
        samplePeriod: `${analysis.dateRange.start} - ${analysis.dateRange.end}`,
        dominantVibe: analysis.inferredSegment
      }
    );

    setHistory((prev) => [snapshot, ...prev]);
    scrollToConsole();
  }, [scrollToConsole]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 1. Ambient Dynamic Canvas Starfield Background */}
      <Starfield />

      {/* 2. Floating Pill Navigation Bar */}
      <Nav
        onOpenModelModal={() => setIsModelModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        historyCount={history.length}
        userProfile={userProfile}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 3. Hero with Bento Geometric Elements */}
        <Hero onExploreClick={scrollToConsole} />

        {/* 4. Interactive Console with 4 Live Sliders & 3-Way Segment Meter */}
        <Console
          inputs={inputs}
          onChangeInput={handleInputChange}
          prediction={prediction}
          onReset={handleReset}
          onRandomize={handleRandomize}
          onSelectSegmentPreset={handleSelectSegmentPreset}
          onSaveSnapshot={() => handleSaveCurrentSnapshot()}
          onOpenImportModal={() => setIsImportModalOpen(true)}
        />

        {/* 5. Interactive Celestial Multi-Dimensional Topology Visualizer */}
        <CelestialOrbitChart inputs={inputs} prediction={prediction} />

        {/* 6. Behavioral DNA & Centroid Deviation Comparisons */}
        <FeatureRadar inputs={inputs} prediction={prediction} />

        {/* 7. Known Listener Archetype Presets */}
        <ArchetypePresets
          onSelectPreset={handleSelectPreset}
          activeSegment={prediction.segmentName}
        />

        {/* 8. History & Drift Chronological Section */}
        <HistorySection
          history={history}
          onLoadSnapshot={handleLoadSnapshot}
          onSaveCurrentSnapshot={handleSaveCurrentSnapshot}
          onDeleteSnapshot={handleDeleteSnapshot}
          onClearHistory={handleClearHistory}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          currentInputs={inputs}
          currentSegment={prediction.segmentName}
        />
      </main>

      {/* 9. Minimalist Unsupervised Learning Footer */}
      <Footer onOpenModelModal={() => setIsModelModalOpen(true)} />

      {/* 10. Streaming History Import Modal */}
      <StreamingImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onApplyAnalysis={handleApplyStreamingAnalysis}
      />

      {/* 11. Listener Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
        currentSegment={prediction.segmentName}
      />

      {/* 12. Model Architecture & StandardScaler Math Modal */}
      <ModelDetailsModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
      />
    </div>
  );
}
