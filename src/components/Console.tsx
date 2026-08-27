import React from "react";
import { ListenerInputs, PredictionResult } from "../types";
import { FEATURE_INFO, SEGMENT_DETAILS } from "../data/archetypes";
import { SegmentMeter } from "./SegmentMeter";
import { Sparkles, Clock, Music, FastForward, ListMusic, RotateCcw, Shuffle, Info, Save, UploadCloud } from "lucide-react";

interface ConsoleProps {
  inputs: ListenerInputs;
  onChangeInput: (key: keyof ListenerInputs, value: number) => void;
  prediction: PredictionResult;
  onReset: () => void;
  onRandomize: () => void;
  onSelectSegmentPreset: (segmentName: string) => void;
  onSaveSnapshot?: () => void;
  onOpenImportModal?: () => void;
}

export const Console: React.FC<ConsoleProps> = ({
  inputs,
  onChangeInput,
  prediction,
  onReset,
  onRandomize,
  onSelectSegmentPreset,
  onSaveSnapshot,
  onOpenImportModal
}) => {
  const currentDetail = SEGMENT_DETAILS[prediction.segmentName];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Clock":
        return <Clock className="w-4 h-4" />;
      case "Music":
        return <Music className="w-4 h-4" />;
      case "FastForward":
        return <FastForward className="w-4 h-4" />;
      case "ListMusic":
        return <ListMusic className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  const getFeatureValue = (id: string): number => {
    switch (id) {
      case "listeningHours":
        return inputs.listeningHours;
      case "songsPerDay":
        return inputs.songsPerDay;
      case "skipRate":
        return inputs.skipRate;
      case "playlistCount":
        return inputs.playlistCount;
      default:
        return 0;
    }
  };

  return (
    <section id="console-section" className="relative z-10 py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono mb-3 shadow-md">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Real-Time Inference Console</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Adjust your listening telemetry
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
          Slide the behavioral dials below. The K-Means model continuously scales and calculates Euclidean distances in client memory.
        </p>
      </div>

      {/* Main Bento Container */}
      <div
        id="interactive-clustering-console"
        className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-8 overflow-hidden relative"
      >
        {/* Subtle Top Accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        {/* 1. Live Prediction Header Result Panel - Bento Hero Tile */}
        <div
          id="prediction-result-panel"
          className="relative rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                Predicted Segment
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                {prediction.confidence}% cluster proximity
              </span>
            </div>

            {/* Segment Title */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <h3
                id="predicted-segment-name"
                className="text-2xl sm:text-4xl font-bold text-white tracking-tight"
              >
                {prediction.segmentName}
              </h3>
              <span className="text-xs sm:text-sm text-emerald-400/90 font-mono font-semibold">
                — {currentDetail.subtitle} ({currentDetail.orbitBrightness})
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl font-normal">
              {currentDetail.description}
            </p>
          </div>

          {/* Quick utility actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenImportModal && (
              <button
                onClick={onOpenImportModal}
                id="console-btn-import"
                title="Import Spotify or Apple Music data"
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Import</span>
              </button>
            )}

            {onSaveSnapshot && (
              <button
                onClick={onSaveSnapshot}
                id="console-btn-save-snapshot"
                title="Save this telemetry snapshot to history"
                className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save</span>
              </button>
            )}

            <button
              onClick={onRandomize}
              id="console-btn-randomize"
              title="Generate random listener telemetry"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Random</span>
            </button>
            <button
              onClick={onReset}
              id="console-btn-reset"
              title="Reset to default baseline"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Three-Way Segment Meter */}
        <div className="mb-8">
          <SegmentMeter
            currentSegment={prediction.segmentName}
            onSelectSegment={(seg) => onSelectSegmentPreset(seg)}
          />
        </div>

        {/* 3. Four Behavioral Range Sliders Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {FEATURE_INFO.map((feat) => {
            const val = getFeatureValue(feat.id);
            const percentage = ((val - feat.min) / (feat.max - feat.min)) * 100;

            return (
              <div
                key={feat.id}
                id={`slider-card-${feat.id}`}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group shadow-md"
              >
                {/* Header label & current value pill */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 text-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                      {getIcon(feat.icon)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {feat.label}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal hidden sm:block">
                        {feat.description}
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-emerald-400 shadow-inner">
                    {val} {feat.unit}
                  </div>
                </div>

                {/* Range Slider */}
                <div className="mt-4 mb-2">
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min={feat.min}
                      max={feat.max}
                      step={feat.step}
                      value={val}
                      onChange={(e) =>
                        onChangeInput(
                          feat.id as keyof ListenerInputs,
                          parseFloat(e.target.value)
                        )
                      }
                      id={`range-input-${feat.id}`}
                      className="w-full relative z-10"
                    />
                  </div>

                  {/* Min / Max bounds */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2.5">
                    <span>{feat.min} {feat.unit}</span>
                    <span className="text-slate-400 font-medium">{Math.round(percentage)}% of max</span>
                    <span>{feat.max} {feat.unit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Telemetry Distance Badges - Bento Bottom Status */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-300">Euclidean Distance to Centroids:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg font-semibold ${prediction.clusterIndex === 0 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-slate-950 text-slate-400 border border-slate-800"}`}>
              Casual: {prediction.distances[0].toFixed(2)}
            </span>
            <span className={`px-2.5 py-1 rounded-lg font-semibold ${prediction.clusterIndex === 1 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-slate-950 text-slate-400 border border-slate-800"}`}>
              Explorer: {prediction.distances[1].toFixed(2)}
            </span>
            <span className={`px-2.5 py-1 rounded-lg font-semibold ${prediction.clusterIndex === 2 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-slate-950 text-slate-400 border border-slate-800"}`}>
              Heavy: {prediction.distances[2].toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
