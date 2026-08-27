import React from "react";
import { ListenerInputs, ListenerSegment } from "../types";
import { PRESET_ARCHETYPES } from "../data/archetypes";
import { Sparkles, ArrowUpRight, Zap, Play } from "lucide-react";

interface ArchetypePresetsProps {
  onSelectPreset: (presetValues: ListenerInputs) => void;
  activeSegment: ListenerSegment;
}

export const ArchetypePresets: React.FC<ArchetypePresetsProps> = ({
  onSelectPreset,
  activeSegment
}) => {
  return (
    <section id="archetypes-section" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono mb-3 shadow-md">
          <Zap className="w-3 h-3 text-emerald-400" />
          <span>Preset Archetypes</span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Explore known listener personas
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2">
          Click any persona card to load their empirical telemetry directly into the real-time inference engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PRESET_ARCHETYPES.map((archetype) => {
          const isCurrentSegment = activeSegment === archetype.segment;

          return (
            <button
              key={archetype.id}
              onClick={() => {
                onSelectPreset(archetype.values);
                const consoleEl = document.getElementById("console-section");
                if (consoleEl) consoleEl.scrollIntoView({ behavior: "smooth" });
              }}
              id={`preset-card-${archetype.id}`}
              className={`group text-left p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                isCurrentSegment
                  ? "bg-slate-900 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                  : "bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isCurrentSegment
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-950 text-slate-400 border border-slate-800"
                  }`}>
                    {archetype.badge}
                  </span>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isCurrentSegment
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-950 text-slate-500 group-hover:text-emerald-400 group-hover:bg-slate-800"
                  }`}>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {archetype.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                  {archetype.tagline}
                </p>
              </div>

              {/* Bento Metrics mini grid */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Hours</span>
                  <span className="text-slate-200 font-bold">{archetype.values.listeningHours} hrs/wk</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Songs</span>
                  <span className="text-slate-200 font-bold">{archetype.values.songsPerDay}/day</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Skip Rate</span>
                  <span className="text-slate-200 font-bold">{archetype.values.skipRate}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider">Playlists</span>
                  <span className="text-slate-200 font-bold">{archetype.values.playlistCount}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
