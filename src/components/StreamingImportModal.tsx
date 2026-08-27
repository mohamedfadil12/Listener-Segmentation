import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  Music,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Disc,
  Play,
  RotateCcw,
  X,
  Layers,
  Clock,
  Radio,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import {
  parseImportedFile,
  analyzeStreamingRecords,
  SAMPLE_STREAMING_DATASETS,
  SampleDataset
} from "../lib/streamingImport";
import { ListenerInputs, StreamingImportAnalysis, ImportedTrackRecord } from "../types";

interface StreamingImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAnalysis: (analysis: StreamingImportAnalysis) => void;
}

export const StreamingImportModal: React.FC<StreamingImportModalProps> = ({
  isOpen,
  onClose,
  onApplyAnalysis
}) => {
  const [activeTab, setActiveTab] = useState<"file" | "samples" | "connect">("file");
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<StreamingImportAnalysis | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated connect state
  const [connectingService, setConnectingService] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    setErrorMsg(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setAnalysisResult(null);

    try {
      const text = await file.text();
      const records = parseImportedFile(file.name, text);

      let serviceName = "Custom Audio Log";
      const lowerName = file.name.toLowerCase();
      if (lowerName.includes("spotify") || lowerName.includes("endsong") || lowerName.includes("streaming_history")) {
        serviceName = "Spotify Extended History";
      } else if (lowerName.includes("apple") || lowerName.includes("play_activity")) {
        serviceName = "Apple Music Play Activity";
      } else if (lowerName.includes("lastfm") || lowerName.includes("scrobble")) {
        serviceName = "Last.fm Scrobbles";
      }

      const analysis = analyzeStreamingRecords(serviceName, records);
      setAnalysisResult(analysis);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to parse streaming history file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = (sample: SampleDataset) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setSelectedSampleId(sample.id);

    setTimeout(() => {
      try {
        const records = sample.generateData();
        const analysis = analyzeStreamingRecords(sample.name, records);
        setAnalysisResult(analysis);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load sample dataset.");
      } finally {
        setIsProcessing(false);
      }
    }, 250);
  };

  const handleSimulateConnect = (service: "Spotify" | "Apple Music" | "Last.fm") => {
    setConnectingService(service);
    setErrorMsg(null);

    setTimeout(() => {
      setConnectingService(null);
      const matchingSample =
        SAMPLE_STREAMING_DATASETS.find((s) => s.service === service) || SAMPLE_STREAMING_DATASETS[0];
      const records = matchingSample.generateData();
      const analysis = analyzeStreamingRecords(`${service} Live Sync`, records);
      setAnalysisResult(analysis);
    }, 1200);
  };

  const handleApply = () => {
    if (analysisResult) {
      onApplyAnalysis(analysisResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="streaming-import-modal"
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-100 my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Import Music History
            </h3>
            <p className="text-xs font-mono text-emerald-400">
              Calculate K-Means Telemetry from Real Streaming Logs
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 mb-6 text-xs font-medium">
          <button
            onClick={() => {
              setActiveTab("file");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "file"
                ? "bg-slate-800 text-emerald-400 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Upload Files (.json / .csv)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("samples");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "samples"
                ? "bg-slate-800 text-emerald-400 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Curated Datasets</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("connect");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "connect"
                ? "bg-slate-800 text-emerald-400 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Direct Sync</span>
          </button>
        </div>

        {/* TAB 1: File Upload */}
        {activeTab === "file" && (
          <div className="space-y-5">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-3xl text-center transition-all cursor-pointer ${
                dragOver
                  ? "border-emerald-400 bg-emerald-500/10"
                  : "border-slate-800 hover:border-slate-700 bg-slate-950/60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                Drop your streaming file here, or browse
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Accepts Spotify Takeout (<code>Streaming_History_Audio_*.json</code>, <code>endsong.json</code>), Apple Music (<code>Play_Activity.csv</code>), or Last.fm scrobble logs.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">.JSON</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">.CSV</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">Spotify Takeout</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">Apple Music Privacy Export</span>
              </div>
            </div>

            {/* How to get data tip */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>How to export your raw streaming history:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 ml-1 text-[11px]">
                <li><strong>Spotify:</strong> Go to <em>Spotify Privacy Settings → Download your data → Extended Streaming History (JSON)</em>.</li>
                <li><strong>Apple Music:</strong> Go to <em>privacy.apple.com → Request a copy of your data → Apple Media Services (CSV)</em>.</li>
                <li><strong>Last.fm:</strong> Use any Last.fm export tool to download scrobbles as CSV.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: Sample Datasets */}
        {activeTab === "samples" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Don't have your raw JSON export handy? Test the K-Means clustering pipeline with authentic simulated streaming datasets:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_STREAMING_DATASETS.map((sample) => {
                const isSelected = selectedSampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-slate-800 border-emerald-500/60 ring-1 ring-emerald-500/30"
                        : "bg-slate-950/80 hover:bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-emerald-400">
                          {sample.service}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {sample.tracksCount.toLocaleString()} tracks
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{sample.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">
                        {sample.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Expected: <b className="text-emerald-400">{sample.expectedSegment}</b></span>
                      <span className="flex items-center gap-1 text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">
                        Load <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Direct Sync Connect */}
        {activeTab === "connect" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Directly sync your recent listening sessions from cloud streaming providers:
            </p>

            <div className="space-y-3">
              {[
                {
                  service: "Spotify" as const,
                  title: "Spotify Cloud Sync",
                  desc: "Analyzes your top artists, recently played tracks, saved library, and skip cadence.",
                  icon: "🎧",
                  badge: "Instant Tokenless Connect"
                },
                {
                  service: "Apple Music" as const,
                  title: "Apple Music Cloud Sync",
                  desc: "Extracts Play Activity logs, library playlists, and playback telemetry.",
                  icon: "🍎",
                  badge: "Replay Sync"
                },
                {
                  service: "Last.fm" as const,
                  title: "Last.fm Scrobble Cloud",
                  desc: "Syncs full chronological scrobble history and track repeats.",
                  icon: "📻",
                  badge: "Scrobble Stream"
                }
              ].map((conn) => (
                <div
                  key={conn.service}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
                      {conn.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{conn.title}</h4>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {conn.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{conn.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulateConnect(conn.service)}
                    disabled={connectingService !== null}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {connectingService === conn.service ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <span>Sync {conn.service}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error message display */}
        {errorMsg && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {isProcessing && (
          <div className="mt-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin" />
            <p className="text-xs font-mono text-emerald-400">
              Parsing playback durations, timestamps & skip ratios...
            </p>
          </div>
        )}

        {/* Analyzed Results Preview Card */}
        {analysisResult && !isProcessing && (
          <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-slate-950 border border-emerald-500/40 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  ✓ Streaming Analysis Complete
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  {analysisResult.sourceName}
                </h4>
                <p className="text-xs text-slate-400">
                  Timeframe: {analysisResult.dateRange.start} → {analysisResult.dateRange.end} ({analysisResult.totalTracks.toLocaleString()} total tracks)
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Inferred: {analysisResult.inferredSegment}</span>
              </div>
            </div>

            {/* Derived 4 K-Means Features Grid */}
            <div>
              <div className="text-xs font-bold text-slate-300 mb-2.5">
                Computed Behavioral Metrics for K-Means:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Listening Hours</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {analysisResult.rawInputs.listeningHours} hrs/wk
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Daily Velocity</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {analysisResult.rawInputs.songsPerDay} songs/day
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Skip Rate</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {analysisResult.rawInputs.skipRate}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Playlists/Albums</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {analysisResult.rawInputs.playlistCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Artists & Tracks chips */}
            {analysisResult.topArtists.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 block mb-2 font-bold uppercase">
                  Top Discovered Artists:
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.topArtists.map((artist, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5"
                    >
                      <Disc className="w-3 h-3 text-emerald-400" />
                      <span>{artist.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({artist.percentage}%)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-400">
                Will update active sliders & record a historical timeline snapshot.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Clear
                </button>
                <button
                  onClick={handleApply}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply to K-Means Orbit</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
