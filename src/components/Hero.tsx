import React from "react";
import { motion } from "motion/react";
import { ArrowDown, Sparkles, Disc3, Radio, Activity, Cpu, Layers } from "lucide-react";

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section
      id="hero-section"
      className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 pt-28 pb-16 text-center overflow-hidden"
    >
      {/* Bento Grid Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-blue-500/5 to-amber-500/5 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Bento Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-emerald-400 text-xs font-mono tracking-wider uppercase mb-6 shadow-xl"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300">Bento Cluster Engine</span>
          <span className="text-slate-600">•</span>
          <span>Unsupervised K-Means</span>
        </motion.div>

        {/* Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6 max-w-4xl"
        >
          Every listener has <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
            a celestial shape.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl text-slate-400 font-normal max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Discover where your streaming habits live across three unsupervised orbits—from calm acoustic drifts to deep genre archaeology.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-14"
        >
          <button
            onClick={onExploreClick}
            id="hero-cta-find-segment"
            className="group relative px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-300 shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:shadow-[0_0_36px_rgba(16,185,129,0.55)] flex items-center gap-2"
          >
            <span>Find your segment</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-slate-950" />
          </button>
        </motion.div>

        {/* 3 Orbits Bento Grid Quick Preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl"
        >
          {/* Orbit 1 Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900 transition-all duration-300 shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                  Orbit I
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-slate-200 transition-colors">
                  <Disc3 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-base font-bold text-white mb-1">Casual Listener</div>
              <p className="text-xs text-slate-400 leading-relaxed">Intentional sessions, low skip rate, comfort loops</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Low Skip • Acoustic</span>
              <span className="text-slate-400">~6 hrs/wk</span>
            </div>
          </div>

          {/* Orbit 2 Card - Featured Accent */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-left flex flex-col justify-between shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:border-emerald-500/70 hover:bg-slate-900 transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-semibold">
                  Orbit II
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Radio className="w-4 h-4" />
                </div>
              </div>
              <div className="text-base font-bold text-emerald-400 mb-1">Music Explorer</div>
              <p className="text-xs text-slate-300 leading-relaxed">Curious seeker, high playlist count, deep sampling</p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-400/80">
              <span>High Curation • Agile</span>
              <span className="text-emerald-400 font-bold">~14 hrs/wk</span>
            </div>
          </div>

          {/* Orbit 3 Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left flex flex-col justify-between hover:border-slate-700 hover:bg-slate-900 transition-all duration-300 shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  Orbit III
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-base font-bold text-white mb-1">Heavy Listener</div>
              <p className="text-xs text-slate-400 leading-relaxed">Constant audio backdrop, max volume, high loyalty</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Continuous • 90+ Songs</span>
              <span className="text-slate-400">~28 hrs/wk</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
