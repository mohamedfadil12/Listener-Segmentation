import React, { useState, useMemo } from "react";
import {
  History,
  Sparkles,
  GitCompare,
  Trash2,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  Plus,
  Play,
  RotateCcw,
  Check,
  Music,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  Save,
  CheckCircle2
} from "lucide-react";
import { HistorySnapshot, ListenerInputs, ListenerSegment } from "../types";
import { SnapshotCompareModal } from "./SnapshotCompareModal";

interface HistorySectionProps {
  history: HistorySnapshot[];
  onLoadSnapshot: (snapshot: HistorySnapshot) => void;
  onSaveCurrentSnapshot: (title?: string, note?: string) => void;
  onDeleteSnapshot: (id: string) => void;
  onClearHistory: () => void;
  onOpenImportModal: () => void;
  currentInputs: ListenerInputs;
  currentSegment: ListenerSegment;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onLoadSnapshot,
  onSaveCurrentSnapshot,
  onDeleteSnapshot,
  onClearHistory,
  onOpenImportModal,
  currentInputs,
  currentSegment
}) => {
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>("ALL");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isSavingCustom, setIsSavingCustom] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("");
  const [customNote, setCustomNote] = useState<string>("");
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // Filtered history list
  const filteredHistory = useMemo(() => {
    if (selectedSourceFilter === "ALL") return history;
    if (selectedSourceFilter === "SPOTIFY") {
      return history.filter((h) => h.source.toLowerCase().includes("spotify"));
    }
    if (selectedSourceFilter === "APPLE") {
      return history.filter((h) => h.source.toLowerCase().includes("apple"));
    }
    if (selectedSourceFilter === "MANUAL") {
      return history.filter((h) => h.source === "Manual Telemetry");
    }
    return history;
  }, [history, selectedSourceFilter]);

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleQuickSave = () => {
    onSaveCurrentSnapshot();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleCustomSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCurrentSnapshot(customTitle || undefined, customNote || undefined);
    setIsSavingCustom(false);
    setCustomTitle("");
    setCustomNote("");
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `listener_history_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const snapshotA = history.find((h) => h.id === compareIds[0]);
  const snapshotB = history.find((h) => h.id === compareIds[1]);

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <section id="history-section" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-8 shadow-2xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 mb-2 shadow-sm">
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chronological Milestones</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              Listening History & Segment Drift
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg">
              Track how your listening habits transform across orbits over time. Compare historical sessions and restore past telemetry snapshots.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenImportModal}
              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Import streaming takeout file or sync service"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Import History</span>
            </button>

            <button
              onClick={() => setIsSavingCustom(!isSavingCustom)}
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Current Telemetry</span>
            </button>
          </div>
        </div>

        {/* Save Toast */}
        {saveToast && (
          <div className="mb-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Successfully recorded current {currentSegment} snapshot to history!</span>
          </div>
        )}

        {/* Custom Save Form Expandable */}
        {isSavingCustom && (
          <form
            onSubmit={handleCustomSave}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-4 shadow-inner"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Record Snapshot with Custom Notes
              </h4>
              <span className="text-[11px] font-mono text-emerald-400">
                {currentInputs.listeningHours} hrs • {currentInputs.songsPerDay} songs/day • {currentInputs.skipRate}% skip
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Snapshot Title (e.g., Post-Concert Binge, Final Exam Prep)"
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Optional Note or Mood Description"
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSavingCustom(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs cursor-pointer shadow-sm"
              >
                Confirm & Save
              </button>
            </div>
          </form>
        )}

        {/* Orbit Evolution Timeline Graph Bento Tile */}
        {history.length > 0 && (
          <div className="mb-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Orbit Trajectory Timeline ({history.length} Snapshots)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Chronological left → right progression
              </span>
            </div>

            {/* Visual Node Graph */}
            <div className="relative pt-6 pb-4 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[500px] relative px-4">
                {/* Connecting background dashed track */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 border-b border-dashed border-slate-700 -z-0" />

                {history.slice(0, 8).map((snap, idx) => {
                  const isCasual = snap.prediction.segmentName === "Casual Listener";
                  const isExplorer = snap.prediction.segmentName === "Music Explorer";

                  const dotColor = isCasual
                    ? "bg-slate-400 border-slate-300"
                    : isExplorer
                    ? "bg-emerald-400 border-emerald-300 shadow-[0_0_10px_#10B981]"
                    : "bg-amber-400 border-amber-300 shadow-[0_0_10px_#F59E0B]";

                  return (
                    <button
                      key={snap.id}
                      onClick={() => onLoadSnapshot(snap)}
                      className="group relative z-10 flex flex-col items-center cursor-pointer focus:outline-none"
                      title={`Click to load "${snap.title}" into console`}
                    >
                      {/* Top label */}
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-400 transition-colors mb-2 truncate max-w-[80px]">
                        {snap.stats?.samplePeriod || formatDate(snap.timestamp).split(",")[0]}
                      </span>

                      {/* Node Dot */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${dotColor} transition-transform group-hover:scale-125 flex items-center justify-center`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                      </div>

                      {/* Bottom Segment name badge */}
                      <span className="text-[9px] font-mono mt-2 font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 group-hover:border-emerald-500/50">
                        {isCasual ? "Casual" : isExplorer ? "Explorer" : "Heavy"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar & Compare Trigger */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {["ALL", "SPOTIFY", "APPLE", "MANUAL"].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedSourceFilter(f)}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  selectedSourceFilter === f
                    ? "bg-slate-800 border-emerald-500/50 text-emerald-400 font-bold"
                    : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Compare Toolbar & Export */}
          <div className="flex items-center gap-2">
            {compareIds.length === 2 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Selected (2)</span>
              </button>
            )}

            {history.length > 0 && (
              <button
                onClick={handleExportJson}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Export history as JSON"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}

            {history.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear all historical snapshots?")) {
                    onClearHistory();
                  }
                }}
                className="p-2 rounded-xl bg-slate-950 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Snapshot Feed */}
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-400 text-xs">
            <History className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p>No snapshots found for the selected filter.</p>
            <button
              onClick={handleQuickSave}
              className="mt-3 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs cursor-pointer"
            >
              Record Current Snapshot
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((snap) => {
              const isSelectedForCompare = compareIds.includes(snap.id);
              const isCasual = snap.prediction.segmentName === "Casual Listener";
              const isExplorer = snap.prediction.segmentName === "Music Explorer";

              return (
                <div
                  key={snap.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isSelectedForCompare
                      ? "bg-slate-900 border-emerald-500/70 ring-1 ring-emerald-500/30"
                      : "bg-slate-950/70 hover:bg-slate-950 border-slate-800/80 hover:border-slate-700 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox for compare */}
                    <button
                      type="button"
                      onClick={() => handleToggleCompare(snap.id)}
                      className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isSelectedForCompare
                          ? "bg-emerald-400 border-emerald-400 text-slate-950"
                          : "border-slate-700 bg-slate-900 hover:border-slate-500"
                      }`}
                      title="Select for side-by-side comparison"
                    >
                      {isSelectedForCompare && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isCasual
                              ? "bg-slate-800 text-slate-300 border border-slate-700"
                              : isExplorer
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {snap.prediction.segmentName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {snap.source}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(snap.timestamp)}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{snap.title}</h4>
                      {snap.note && (
                        <p className="text-xs text-slate-400 mt-0.5">{snap.note}</p>
                      )}

                      {/* Mini metric badges */}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-mono text-slate-400">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          <strong className="text-slate-200">{snap.inputs.listeningHours}</strong> hrs/wk
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          <strong className="text-slate-200">{snap.inputs.songsPerDay}</strong> songs/day
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          <strong className="text-slate-200">{snap.inputs.skipRate}%</strong> skip
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          <strong className="text-slate-200">{snap.inputs.playlistCount}</strong> playlists
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <button
                      onClick={() => onLoadSnapshot(snap)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-emerald-400 transition-all flex items-center gap-1 cursor-pointer"
                      title="Load these telemetry numbers into active console sliders"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>

                    <button
                      onClick={() => onDeleteSnapshot(snap.id)}
                      className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete this snapshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {snapshotA && snapshotB && (
        <SnapshotCompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          snapshotA={snapshotA}
          snapshotB={snapshotB}
          onLoadSnapshot={onLoadSnapshot}
        />
      )}
    </section>
  );
};
