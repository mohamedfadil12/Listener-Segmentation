import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: number; // for parallax
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate stars
    const starCount = Math.min(180, Math.floor((width * height) / 8000));
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const layer = Math.random() < 0.2 ? 3 : Math.random() < 0.5 ? 2 : 1;
      const baseAlpha = 0.2 + Math.random() * 0.7;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: layer === 3 ? 1.8 + Math.random() * 1.2 : layer === 2 ? 1.0 + Math.random() * 0.8 : 0.6 + Math.random() * 0.6,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
        layer
      });
    }

    // Shooting stars queue
    const shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = Date.now();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - centerX) / centerX;
      mouseRef.current.targetY = (e.clientY - centerY) / centerY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;
    const render = () => {
      time += 0.016;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep sky gradient base for Bento slate dark mode
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#090d16");
      skyGrad.addColorStop(0.5, "#030712");
      skyGrad.addColorStop(1, "#020617");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle celestial emerald nebula glow
      const nebula1 = ctx.createRadialGradient(
        width * 0.5 + mouseRef.current.x * 30,
        height * 0.25 + mouseRef.current.y * 20,
        10,
        width * 0.5,
        height * 0.25,
        width * 0.55
      );
      nebula1.addColorStop(0, "rgba(16, 185, 129, 0.08)");
      nebula1.addColorStop(0.5, "rgba(15, 23, 42, 0.15)");
      nebula1.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      // Warm celestial amber/cyan subtle accent glow
      const amberNebula = ctx.createRadialGradient(
        width * 0.8 + mouseRef.current.x * 20,
        height * 0.75 + mouseRef.current.y * 20,
        5,
        width * 0.8,
        height * 0.75,
        width * 0.4
      );
      amberNebula.addColorStop(0, "rgba(14, 165, 233, 0.06)");
      amberNebula.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = amberNebula;
      ctx.fillRect(0, 0, width, height);

      // Draw and animate stars
      stars.forEach((star) => {
        // Twinkle calculation
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        star.alpha = star.baseAlpha * (0.6 + 0.4 * twinkle);

        // Parallax offset based on layer
        const parallaxX = mouseRef.current.x * star.layer * 12;
        const parallaxY = mouseRef.current.y * star.layer * 12;

        const posX = (star.x + parallaxX + width) % width;
        const posY = (star.y + parallaxY + height) % height;

        ctx.beginPath();
        ctx.arc(posX, posY, star.size, 0, Math.PI * 2);

        // Star color with warm/cool tint variation
        if (star.layer === 3) {
          ctx.fillStyle = `rgba(255, 248, 230, ${star.alpha})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(242, 184, 92, 0.5)";
        } else {
          ctx.fillStyle = `rgba(225, 235, 255, ${star.alpha})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Spawn shooting stars periodically
      const now = Date.now();
      if (now - lastShootingStarTime > 8000 && Math.random() < 0.3) {
        lastShootingStarTime = now;
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.4),
          length: 60 + Math.random() * 50,
          speed: 7 + Math.random() * 5,
          angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
          alpha: 1,
          life: 0,
          maxLife: 40
        });
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha = Math.max(0, 1 - s.life / s.maxLife);

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(242, 184, 92, 0)");
        grad.addColorStop(0.7, `rgba(242, 184, 92, ${s.alpha * 0.5})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="celestial-starfield-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
