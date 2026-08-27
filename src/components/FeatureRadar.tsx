import React from "react";
import { ListenerInputs, PredictionResult } from "../types";
import { SEGMENT_DETAILS } from "../data/archetypes";
import { Activity, CheckCircle2, TrendingUp, Headphones, Cpu } from "lucide-react";

interface FeatureRadarProps {
  inputs: ListenerInputs;
  prediction: PredictionResult;
}

export const FeatureRadar: React.FC<FeatureRadarProps> = ({
  inputs,
  prediction
}) => {
  const currentDetail = SEGMENT_DETAILS[prediction.segmentName];
  const activeCenter = prediction.unscaledCenters[prediction.clusterIndex];

  // Feature comparison pairs
  const featureComparisons = [
    {
      label: "Weekly Listening",
      userVal: inputs.listeningHours,
      clusterVal: activeCenter[0],
      unit: "hrs/wk",
      max: 40,
      description: "Session volume"
    },
    {
      label: "Daily Song Output",
      userVal: inputs.songsPerDay,
      clusterVal: activeCenter[1],
      unit: "tracks/day",
      max: 150,
      description: "Music throughput"
    },
    {
      label: "Skip Probability",
      userVal: inputs.skipRate,
      clusterVal: activeCenter[2],
      unit: "%",
      max: 100,
      description: "Sampling patience"
    },
    {
      label: "Playlist Architecture",
      userVal: inputs.playlistCount,
      clusterVal: activeCenter[3],
      unit: "playlists",
      max: 40,
      description: "Curation index"
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Behavioral Fingerprint Bento Tile */}
        <div className="lg:col-span-1 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 mb-4 shadow-sm">
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              <span>Behavioral DNA</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              Listening Traits
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Why the unsupervised algorithm categorized your profile into <span className="text-emerald-400 font-semibold">{prediction.segmentName}</span>:
            </p>

            <ul className="space-y-3">
              {currentDetail.keyBehaviors.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5 font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Streaming Profile</span>
            </div>
            <p className="text-xs text-slate-300 font-normal italic leading-relaxed">
              "{currentDetail.streamingProfile}"
            </p>
          </div>
        </div>

        {/* Right: Comparative Metric Deviation Bars Bento Tile */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Telemetry vs. Cluster Centroid
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct alignment between your input dials and the discovered center values
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                  Your Telemetry
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  Cluster Center
                </span>
              </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-4">
              {featureComparisons.map((fc, i) => {
                const userPct = Math.min(100, Math.max(0, (fc.userVal / fc.max) * 100));
                const clusterPct = Math.min(100, Math.max(0, (fc.clusterVal / fc.max) * 100));

                return (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-sm">
                    <div className="flex items-center justify-between text-xs mb-2.5">
                      <span className="font-bold text-white">{fc.label}</span>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-emerald-400 font-bold">
                          You: {fc.userVal} {fc.unit}
                        </span>
                        <span className="text-slate-400">
                          Centroid: {fc.clusterVal} {fc.unit}
                        </span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="relative h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      {/* Cluster reference mark */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white z-10 shadow-[0_0_6px_#FFF]"
                        style={{ left: `${clusterPct}%` }}
                        title={`Cluster centroid: ${fc.clusterVal} ${fc.unit}`}
                      />
                      {/* User fill */}
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                        style={{ width: `${userPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Multi-variant Euclidean convergence verified in client JS
            </span>
            <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              k = 3 Clusters
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
