import React from "react";
import { Orbit, Sparkles, Terminal } from "lucide-react";

interface FooterProps {
  onOpenModelModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModelModal }) => {
  return (
    <footer className="relative z-10 border-t border-slate-800 py-12 px-4 sm:px-6 text-center bg-slate-950/60">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        {/* Unsupervised Learning Note (Explicitly requested by user spec) */}
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed font-normal">
          This model uses <strong className="text-white font-bold">unsupervised K-Means clustering</strong> — these three listener segments were organically discovered by geometric density in the data, not classified from predefined human labels or an answer key.
        </p>

        {/* Minimal Sub-actions & Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-mono mt-2">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            StandardScaler + Euclidean Centroids
          </span>
          <span className="text-slate-600">•</span>
          <button
            onClick={onOpenModelModal}
            className="hover:text-emerald-400 underline decoration-slate-600 underline-offset-4 transition-colors font-medium cursor-pointer"
          >
            Inspect Model Parameters & Formula
          </button>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <Orbit className="w-3 h-3 text-slate-500" />
            Client-Side Inference in JS
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-mono mt-4">
          Listener Segmentation © {new Date().getFullYear()} — Audio Archetypes Bento
        </div>
      </div>
    </footer>
  );
};
