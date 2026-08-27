import React from "react";
import { Sparkles, Orbit, Sliders, Layers, Info, History, User, UploadCloud } from "lucide-react";
import { UserProfile } from "../types";

interface NavProps {
  onOpenModelModal: () => void;
  onOpenProfileModal: () => void;
  onOpenImportModal: () => void;
  historyCount: number;
  userProfile: UserProfile;
}

export const Nav: React.FC<NavProps> = ({
  onOpenModelModal,
  onOpenProfileModal,
  onOpenImportModal,
  historyCount,
  userProfile
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <nav
        id="main-navigation-bar"
        className="pointer-events-auto w-full max-w-6xl flex items-center justify-between px-3 sm:px-5 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl transition-all duration-300 gap-2"
      >
        {/* Left: Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-slate-100 hover:text-white transition-colors group shrink-0"
          id="nav-brand-logo"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform">
            <Orbit className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
              Listener Segmentation
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>
            <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase hidden sm:block">
              Bento ML Cluster v1.0
            </span>
          </div>
        </a>

        {/* Center: Nav links (visible on lg+) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs text-slate-300">
          <button
            onClick={() => scrollTo("hero-section")}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-all font-medium cursor-pointer"
            id="nav-link-overview"
          >
            Overview
          </button>
          <button
            onClick={() => scrollTo("console-section")}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 font-medium cursor-pointer"
            id="nav-link-console"
          >
            <Sliders className="w-3 h-3 text-emerald-400" />
            Console
          </button>
          <button
            onClick={() => scrollTo("history-section")}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 font-medium cursor-pointer"
            id="nav-link-history"
          >
            <History className="w-3 h-3 text-cyan-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => scrollTo("orbit-section")}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 font-medium cursor-pointer"
            id="nav-link-orbits"
          >
            <Orbit className="w-3 h-3 text-blue-400" />
            Topology
          </button>
          <button
            onClick={() => scrollTo("archetypes-section")}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 font-medium cursor-pointer"
            id="nav-link-archetypes"
          >
            <Layers className="w-3 h-3 text-amber-400" />
            Archetypes
          </button>
          <button
            onClick={onOpenModelModal}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1 text-slate-400 hover:text-slate-200 font-medium cursor-pointer"
            id="nav-link-model-details"
          >
            <Info className="w-3 h-3" />
            ML Details
          </button>
        </div>

        {/* Right: Profile & Import Actions Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Import Music Service */}
          <button
            onClick={onOpenImportModal}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Import Spotify or Apple Music data"
            id="nav-btn-import"
          >
            <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Import Music</span>
          </button>

          {/* User Profile Button */}
          <button
            onClick={onOpenProfileModal}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Edit listener profile"
            id="nav-btn-profile"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="max-w-[80px] sm:max-w-[110px] truncate">{userProfile.name}</span>
          </button>

          {/* Find Segment Button */}
          <button
            onClick={() => scrollTo("console-section")}
            className="px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/60 transition-all duration-200 shadow-[0_0_16px_rgba(16,185,129,0.15)] flex items-center gap-1.5 cursor-pointer"
            id="nav-cta-find-segment"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Console</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

