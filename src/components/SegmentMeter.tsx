import React from "react";
import { ListenerSegment } from "../types";
import { Moon, Compass, Sun } from "lucide-react";

interface SegmentMeterProps {
  currentSegment: ListenerSegment;
  onSelectSegment?: (segment: ListenerSegment) => void;
}

export const SegmentMeter: React.FC<SegmentMeterProps> = ({
  currentSegment,
  onSelectSegment
}) => {
  const segments: {
    id: ListenerSegment;
    label: string;
    orbitNum: string;
    orbitDesc: string;
    icon: typeof Moon;
  }[] = [
    {
      id: "Casual Listener",
      label: "Casual Listener",
      orbitNum: "Orbit I",
      orbitDesc: "Low Skip • Acoustic",
      icon: Moon
    },
    {
      id: "Music Explorer",
      label: "Music Explorer",
      orbitNum: "Orbit II",
      orbitDesc: "High Playlists • Dynamic",
      icon: Compass
    },
    {
      id: "Heavy Listener",
      label: "Heavy Listener",
      orbitNum: "Orbit III",
      orbitDesc: "High Volume • Daily Flow",
      icon: Sun
    }
  ];

  return (
    <div className="w-full" id="three-way-segment-meter">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          K-Means Cluster Matrix
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Click to load archetype
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
        {segments.map((item) => {
          const isActive = currentSegment === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSegment && onSelectSegment(item.id)}
              className={`relative text-left p-3.5 sm:p-4 rounded-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                isActive
                  ? "bg-slate-900 border border-emerald-500/50 shadow-lg shadow-emerald-500/10 text-white"
                  : "bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
              id={`segment-meter-${item.id.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {/* Active indicator top bar */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-[0_0_8px_#10B981]" />
              )}

              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                    isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-400"
                  }`}
                >
                  {item.orbitNum}
                </span>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800 text-slate-500 group-hover:text-slate-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isActive ? "text-white" : "text-slate-300"
                  }`}
                >
                  {item.label}
                </div>
                <div
                  className={`text-[11px] mt-0.5 font-mono ${
                    isActive ? "text-emerald-400/90" : "text-slate-500"
                  }`}
                >
                  {item.orbitDesc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
