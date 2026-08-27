import React, { useRef, useEffect } from "react";
import { ListenerInputs, PredictionResult } from "../types";
import { SEGMENT_DETAILS } from "../data/archetypes";
import { Orbit, Sparkles, Compass, Layers } from "lucide-react";

interface CelestialOrbitChartProps {
  inputs: ListenerInputs;
  prediction: PredictionResult;
}

export const CelestialOrbitChart: React.FC<CelestialOrbitChartProps> = ({
  inputs,
  prediction
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = Math.min(480, Math.max(360, width * 0.58)));

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(480, Math.max(360, width * 0.58));
    };

    window.addEventListener("resize", handleResize);

    let angleTick = 0;

    // Cluster reference points mapped to 2D projection
    // PCA / t-SNE-like 2D projection of the 3 clusters:
    // Cluster 0 (Casual): Left-center (dim, low activity)
    // Cluster 1 (Explorer): Top-Right (high playlist, high skip)
    // Cluster 2 (Heavy): Bottom-Right (max hours, high volume)
    const clusterPositions = [
      { id: 0, name: "Casual Orbit", angle: Math.PI * 0.85, radiusRatio: 0.38, color: "#94A3B8" },
      { id: 1, name: "Explorer Orbit", angle: Math.PI * 0.1, radiusRatio: 0.65, color: "#10B981" },
      { id: 2, name: "Heavy Orbit", angle: Math.PI * 1.45, radiusRatio: 0.88, color: "#FBBF24" }
    ];

    // Static sample background stars for each constellation cluster
    const clusterStars: { x: number; y: number; cluster: number; size: number; alpha: number }[] = [];
    for (let c = 0; c < 3; c++) {
      for (let i = 0; i < 24; i++) {
        const spreadAngle = (c * 2 * Math.PI) / 3 + (Math.random() - 0.5) * 1.1;
        const spreadRadius = (0.28 + c * 0.28) * (0.8 + Math.random() * 0.4);
        clusterStars.push({
          x: spreadAngle,
          y: spreadRadius,
          cluster: c,
          size: 1 + Math.random() * 1.5,
          alpha: 0.3 + Math.random() * 0.6
        });
      }
    }

    const render = () => {
      angleTick += 0.008;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.85;

      // 1. Draw concentric orbit track rings
      const rings = [0.38, 0.65, 0.88];
      rings.forEach((rRatio, idx) => {
        const r = maxRadius * rRatio;
        const isSelectedOrbit = prediction.clusterIndex === idx;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = isSelectedOrbit
          ? "rgba(16, 185, 129, 0.5)"
          : "rgba(51, 65, 85, 0.5)";
        ctx.lineWidth = isSelectedOrbit ? 1.8 : 1;
        if (!isSelectedOrbit) {
          ctx.setLineDash([4, 6]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbit ring label
        ctx.font = "10px monospace";
        ctx.fillStyle = isSelectedOrbit ? "#10B981" : "rgba(100, 116, 139, 0.6)";
        ctx.fillText(
          idx === 0 ? "ORBIT I (CASUAL)" : idx === 1 ? "ORBIT II (EXPLORER)" : "ORBIT III (HEAVY)",
          centerX - 50,
          centerY - r - 4
        );
      });

      // 2. Draw background cluster star nodes
      clusterStars.forEach((star) => {
        const starAngle = star.x + angleTick * (star.cluster === 1 ? 0.4 : -0.2);
        const starDist = star.y * maxRadius;
        const sx = centerX + Math.cos(starAngle) * starDist;
        const sy = centerY + Math.sin(starAngle) * starDist;

        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fillStyle =
          star.cluster === prediction.clusterIndex
            ? `rgba(16, 185, 129, ${star.alpha * 0.8})`
            : `rgba(148, 163, 184, ${star.alpha * 0.25})`;
        ctx.fill();
      });

      // 3. Draw Cluster Centroid Anchors
      clusterPositions.forEach((cp, idx) => {
        const anchorAngle = cp.angle + angleTick * 0.15;
        const anchorR = maxRadius * cp.radiusRatio;
        const ax = centerX + Math.cos(anchorAngle) * anchorR;
        const ay = centerY + Math.sin(anchorAngle) * anchorR;

        const isCurrent = prediction.clusterIndex === idx;

        // Centroid glow
        if (isCurrent) {
          const glowGrad = ctx.createRadialGradient(ax, ay, 2, ax, ay, 24);
          glowGrad.addColorStop(0, "rgba(16, 185, 129, 0.8)");
          glowGrad.addColorStop(1, "rgba(16, 185, 129, 0)");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(ax, ay, 24, 0, Math.PI * 2);
          ctx.fill();
        }

        // Centroid core dot
        ctx.beginPath();
        ctx.arc(ax, ay, isCurrent ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isCurrent ? "#10B981" : "rgba(148, 163, 184, 0.5)";
        ctx.fill();
        ctx.strokeStyle = isCurrent ? "#FFFFFF" : "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.font = isCurrent ? "bold 11px monospace" : "10px monospace";
        ctx.fillStyle = isCurrent ? "#10B981" : "rgba(148, 163, 184, 0.7)";
        ctx.fillText(cp.name, ax + 10, ay + 3);
      });

      // 4. Calculate dynamic User telemetry star coordinates
      const scaledH = prediction.scaledInputs[0];
      const scaledS = prediction.scaledInputs[1];
      const scaledSkip = prediction.scaledInputs[2];
      const scaledPlay = prediction.scaledInputs[3];

      // Normalized 2D coordinate from scaled inputs
      const userNormX = (scaledH * 0.5 + scaledS * 0.5);
      const userNormY = (scaledSkip * 0.6 - scaledPlay * 0.4);

      // Clamp and map to celestial stage
      const userDist = Math.min(
        maxRadius * 0.95,
        Math.max(
          maxRadius * 0.2,
          (0.48 + userNormX * 0.22) * maxRadius
        )
      );
      const userAngle = Math.PI * 0.3 + userNormY * 0.8 + angleTick * 0.15;

      const userX = centerX + Math.cos(userAngle) * userDist;
      const userY = centerY + Math.sin(userAngle) * userDist;

      // 5. Draw Constellation Tether Line to active Centroid
      const activeCentroidPos = clusterPositions[prediction.clusterIndex];
      const activeAngle = activeCentroidPos.angle + angleTick * 0.15;
      const activeR = maxRadius * activeCentroidPos.radiusRatio;
      const activeX = centerX + Math.cos(activeAngle) * activeR;
      const activeY = centerY + Math.sin(activeAngle) * activeR;

      ctx.beginPath();
      ctx.moveTo(userX, userY);
      ctx.lineTo(activeX, activeY);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 6. Draw User Pulsing Celestial Node
      const userGlow = ctx.createRadialGradient(userX, userY, 2, userX, userY, 32);
      userGlow.addColorStop(0, "rgba(16, 185, 129, 0.9)");
      userGlow.addColorStop(0.5, "rgba(16, 185, 129, 0.3)");
      userGlow.addColorStop(1, "rgba(16, 185, 129, 0)");
      ctx.fillStyle = userGlow;
      ctx.beginPath();
      ctx.arc(userX, userY, 32, 0, Math.PI * 2);
      ctx.fill();

      // Core star
      ctx.beginPath();
      ctx.arc(userX, userY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // User Label Pill
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("YOU (ACTIVE TELEMETRY)", userX + 12, userY - 8);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [inputs, prediction]);

  const detail = SEGMENT_DETAILS[prediction.segmentName];

  return (
    <section id="orbit-section" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 mb-2 shadow-sm">
              <Orbit className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Dimensional Feature Space</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              Celestial Cluster Topology
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg">
              Projected 4-dimensional normalized coordinate space representing songs, hours, skip behavior, and playlist volume.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs shadow-md">
            <Compass className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-slate-500 text-[10px] uppercase font-mono font-bold">Current Orbit</div>
              <div className="text-emerald-400 font-bold">{detail.orbitName}</div>
            </div>
          </div>
        </div>

        {/* Canvas stage */}
        <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center p-2 shadow-inner">
          <canvas ref={canvasRef} className="w-full h-auto block" />
          
          {/* Bottom telemetry overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-[11px] font-mono text-slate-300 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-white">StandardScaler z-scores:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-slate-400">
              <span>H: <b className="text-emerald-400 font-semibold">{prediction.scaledInputs[0].toFixed(2)}</b></span>
              <span>S: <b className="text-emerald-400 font-semibold">{prediction.scaledInputs[1].toFixed(2)}</b></span>
              <span>Skip: <b className="text-emerald-400 font-semibold">{prediction.scaledInputs[2].toFixed(2)}</b></span>
              <span>PL: <b className="text-emerald-400 font-semibold">{prediction.scaledInputs[3].toFixed(2)}</b></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
