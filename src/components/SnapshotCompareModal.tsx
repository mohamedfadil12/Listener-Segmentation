import React from "react";
import {
  GitCompare,
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
  Clock,
  Layers,
  Calendar
} from "lucide-react";
import { HistorySnapshot, ListenerInputs, PredictionResult } from "../types";

interface SnapshotCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshotA: HistorySnapshot;
  snapshotB: HistorySnapshot;
  onLoadSnapshot?: (snapshot: HistorySnapshot) => void;
}

export const SnapshotCompareModal: React.FC<SnapshotCompareModalProps> = ({
  isOpen,
  onClose,
  snapshotA,
  snapshotB,
  onLoadSnapshot
}) => {
  if (!isOpen || !snapshotA || !snapshotB) return null;

  const metrics = [
    {
      key: "listeningHours" as keyof ListenerInputs,
      label: "Listening Hours",
      unit: "hrs/wk",
      valA: snapshotA.inputs.listeningHours,
      valB: snapshotB.inputs.listeningHours,
      max: 40
    },
    {
      key: "songsPerDay" as keyof ListenerInputs,
      label: "Songs Per Day",
      unit: "songs",
      valA: snapshotA.inputs.songsPerDay,
      valB: snapshotB.inputs.songsPerDay,
      max: 150
    },
    {
      key: "skipRate" as keyof ListenerInputs,
      label: "Skip Rate",
      unit: "%",
      valA: snapshotA.inputs.skipRate,
      valB: snapshotB.inputs.skipRate,
      max: 100
    },
    {
      key: "playlistCount" as keyof ListenerInputs,
      label: "Playlists / Albums",
      unit: "",
      valA: snapshotA.inputs.playlistCount,
      valB: snapshotB.inputs.playlistCount,
      max: 40
    }
  ];

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return isoStr;
    }
  };

  const isSameSegment = snapshotA.prediction.segmentName === snapshotB.prediction.segmentName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="snapshot-compare-modal"
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

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Snapshot Drift Comparison
            </h3>
            <p className="text-xs font-mono text-emerald-400">
              Behavioral Delta & Cluster Trajectory
            </p>
          </div>
        </div>

        {/* Comparison Overview Header Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Card A */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                Snapshot A (Baseline)
              </span>
              <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(snapshotA.timestamp)}
              </span>
            </div>
            <h4 className="text-base font-bold text-white mb-1 truncate">{snapshotA.title}</h4>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{snapshotA.prediction.segmentName}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Source: <span className="text-slate-300">{snapshotA.source}</span>
            </div>
          </div>

          {/* Card B */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30">
                Snapshot B (Target)
              </span>
              <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(snapshotB.timestamp)}
              </span>
            </div>
            <h4 className="text-base font-bold text-white mb-1 truncate">{snapshotB.title}</h4>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{snapshotB.prediction.segmentName}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Source: <span className="text-slate-300">{snapshotB.source}</span>
            </div>
          </div>
        </div>

        {/* Orbit Transition Banner */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-bold">Segment Classification Drift:</span>
          </div>

          <div className="flex items-center gap-2 font-mono font-bold">
            <span className="text-slate-300">{snapshotA.prediction.segmentName}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span className={isSameSegment ? "text-slate-300" : "text-emerald-400"}>
              {snapshotB.prediction.segmentName}
            </span>
            {isSameSegment && (
              <span className="text-[10px] text-slate-500 font-normal">(Stable Orbit)</span>
            )}
          </div>
        </div>

        {/* Detailed Metrics Delta Table */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Feature Value Deviations (B vs A):
          </h4>

          <div className="space-y-2">
            {metrics.map((m) => {
              const delta = m.valB - m.valA;
              const hasChanged = delta !== 0;
              const isPositive = delta > 0;

              return (
                <div
                  key={m.key}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-white">{m.label}</span>
                      <span className="font-mono text-xs text-slate-400">
                        {m.valA} → <strong className="text-white">{m.valB}</strong> {m.unit}
                      </span>
                    </div>

                    {/* Progress bars visualizer */}
                    <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 bg-slate-600/70 rounded-full"
                        style={{ width: `${(m.valA / m.max) * 100}%` }}
                      />
                      <div
                        className="absolute top-0 bottom-0 bg-emerald-400 rounded-full opacity-80"
                        style={{ width: `${(m.valB / m.max) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="sm:w-32 flex justify-end shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${
                        !hasChanged
                          ? "bg-slate-900 text-slate-400 border border-slate-800"
                          : isPositive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {!hasChanged ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {delta > 0 ? `+${delta}` : delta} {m.unit}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            StandardScaler normalized 4D cluster shift
          </span>

          <div className="flex items-center gap-2">
            {onLoadSnapshot && (
              <button
                onClick={() => {
                  onLoadSnapshot(snapshotB);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-colors cursor-pointer"
              >
                Load Snapshot B into Console
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
