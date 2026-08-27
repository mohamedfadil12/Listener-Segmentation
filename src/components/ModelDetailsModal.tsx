import React from "react";
import { X, Cpu, Layers, BarChart2, Check, ExternalLink } from "lucide-react";
import modelParamsData from "../data/model_params.json";

interface ModelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelDetailsModal: React.FC<ModelDetailsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        id="model-details-modal-container"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0F1E36] border border-white/15 p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] text-slate-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-model-modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Unsupervised K-Means Architecture
            </h3>
            <p className="text-xs font-mono text-emerald-400">
              Scikit-Learn Export • Client-Side Inference
            </p>
          </div>
        </div>

        {/* Section 1: Core ML Concepts */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              How Unsupervised Clustering Works
            </h4>
            <p className="leading-relaxed text-slate-400 font-normal">
              Unlike supervised classification, no human pre-labeled these listener groups. The K-Means algorithm grouped tens of thousands of listener sessions strictly by discovering natural geometric clusters and spatial density in the 4-dimensional behavioral feature space.
            </p>
          </div>

          {/* Section 2: Mathematical Transformations */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              Inference Formulas
            </h4>
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">1. StandardScaler:</span> z_i = (x_i - μ_i) / σ_i
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">2. Euclidean Distance:</span> d(z, c_k) = √ ∑_{'{'}i=1{'}'}^4 (z_i - c_k,i)²
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">3. Segment Assignment:</span> k* = argmin_k d(z, c_k)
              </div>
            </div>
          </div>

          {/* Section 3: Model Parameters Export */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h4 className="font-bold text-white mb-2">Exported Model Parameters (JSON)</h4>
            <pre className="p-3 rounded-xl bg-slate-950 text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800">
              {JSON.stringify(modelParamsData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Zero network requests • 100% in-browser
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors shadow-md"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
