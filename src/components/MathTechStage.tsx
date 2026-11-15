import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { MathTex } from './MathTex';

type StageMode = 'harmonics' | 'geodesic' | 'lattice';

interface ModeMeta {
  id: StageMode;
  label: string;
  tex: string;
  symbolsTex: string;
}

const STAGE_MODES: ModeMeta[] = [
  {
    id: 'harmonics',
    label: 'Harmonics',
    tex: String.raw`r(t) = \begin{cases} x(t) = A\sin(3\omega t + \phi) \\ y(t) = B\sin(2\omega t) \end{cases}`,
    symbolsTex: String.raw`\omega,\;\phi,\;\pi`,
  },
  {
    id: 'geodesic',
    label: '3D Projection',
    tex: String.raw`R_y(\theta) = \begin{bmatrix} \cos\theta & 0 & \sin\theta \\ 0 & 1 & 0 \\ -\sin\theta & 0 & \cos\theta \end{bmatrix}`,
    symbolsTex: String.raw`\theta,\;\psi,\;\mathbb{R}^3`,
  },
  {
    id: 'lattice',
    label: 'Vector Field',
    tex: String.raw`\mathbf{F}(x,y) = \left(-\frac{\partial\psi}{\partial y},\;\frac{\partial\psi}{\partial x}\right)`,
    symbolsTex: String.raw`\nabla,\;\partial,\;\psi`,
  },
];

export const MathTechStage: React.FC = () => {
  const [mode, setMode] = useState<StageMode>('harmonics');
  const [isPlaying, setIsPlaying] = useState(true);
  const [phaseResetKey, setPhaseResetKey] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0.5,
    y: 0.5,
    active: false,
  });
  const shouldReduceMotion = useReducedMotion();

  const currentMeta = STAGE_MODES.find((m) => m.id === mode) ?? STAGE_MODES[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const drawGrid = (w: number, h: number) => {
      const step = 32;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = step; x < w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = step; y < h; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.beginPath();
      ctx.moveTo(w / 2, 16);
      ctx.lineTo(w / 2, h - 16);
      ctx.moveTo(16, h / 2);
      ctx.lineTo(w - 16, h / 2);
      ctx.stroke();
    };

    const drawHarmonics = (w: number, h: number, t: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const rx = Math.min(w, h) * 0.34;
      const ry = Math.min(w, h) * 0.28;
      const pointerShift = pointerRef.current.active ? (pointerRef.current.x - 0.5) * 1.4 : 0;
      const freqRatioY = pointerRef.current.active ? 2 + (pointerRef.current.y - 0.5) * 0.8 : 2;

      ctx.strokeStyle = 'rgba(161, 161, 170, 0.22)';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      const samples = 360;
      for (let i = 0; i <= samples; i++) {
        const u = (i / samples) * Math.PI * 2;
        const x = cx + rx * Math.sin(3 * u + t * 0.55 + pointerShift);
        const y = cy + ry * Math.sin(freqRatioY * u - t * 0.3);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const u = (i / samples) * Math.PI * 2;
        const x = cx + rx * Math.sin(3 * u + t + pointerShift);
        const y = cy + ry * Math.sin(freqRatioY * u);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const px = cx + rx * Math.sin(3 * t + t + pointerShift);
      const py = cy + ry * Math.sin(freqRatioY * t);

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(px, cy);
      ctx.lineTo(px, py);
      ctx.lineTo(cx, py);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(rx, ry) * 0.42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eff6ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const drawGeodesic = (w: number, h: number, t: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.32;

      const rotY = t * 0.65 + (pointerRef.current.active ? (pointerRef.current.x - 0.5) * 1.8 : 0);
      const rotX = 0.45 + t * 0.35 + (pointerRef.current.active ? (pointerRef.current.y - 0.5) * 1.4 : 0);

      const project = (x: number, y: number, z: number) => {
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const scale = 3.2 / (3.2 - z2);
        return {
          sx: cx + x1 * radius * scale,
          sy: cy + y2 * radius * scale,
          depth: z2,
        };
      };

      const majorR = 0.72;
      const minorR = 0.32;
      const uSteps = 18;
      const vSteps = 10;

      const points: { sx: number; sy: number; depth: number }[][] = [];
      for (let i = 0; i < uSteps; i++) {
        const u = (i / uSteps) * Math.PI * 2;
        const ring: { sx: number; sy: number; depth: number }[] = [];
        for (let j = 0; j < vSteps; j++) {
          const v = (j / vSteps) * Math.PI * 2;
          const x = (majorR + minorR * Math.cos(v)) * Math.cos(u);
          const y = (majorR + minorR * Math.cos(v)) * Math.sin(u);
          const z = minorR * Math.sin(v);
          ring.push(project(x, y, z));
        }
        points.push(ring);
      }

      for (let i = 0; i < uSteps; i++) {
        const nextI = (i + 1) % uSteps;
        for (let j = 0; j < vSteps; j++) {
          const nextJ = (j + 1) % vSteps;
          const p1 = points[i][j];
          const p2 = points[nextI][j];
          const p3 = points[i][nextJ];
          const alpha = Math.max(0.12, Math.min(0.85, 0.4 + p1.depth * 0.45));

          ctx.strokeStyle = i % 3 === 0 ? `rgba(59, 130, 246, ${alpha})` : `rgba(228, 228, 231, ${alpha * 0.45})`;
          ctx.lineWidth = i % 3 === 0 ? 1.4 : 1;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p3.sx, p3.sy);
          ctx.stroke();
        }
      }

      for (let i = 0; i < uSteps; i += 3) {
        const p = points[i][0];
        if (p.depth > -0.1) {
          ctx.fillStyle = '#60a5fa';
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 2.75, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawLattice = (w: number, h: number, t: number) => {
      const cols = 11;
      const rows = 8;
      const padX = 48;
      const padY = 48;
      const cellW = (w - padX * 2) / (cols - 1);
      const cellH = (h - padY * 2) / (rows - 1);
      const mx = pointerRef.current.x * w;
      const my = pointerRef.current.y * h;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = padX + c * cellW;
          const y = padY + r * cellH;
          const baseAngle = Math.sin(c * 0.45 + t) * Math.cos(r * 0.45 - t * 0.8) * Math.PI;

          let angle = baseAngle;
          let strength = 0.35;

          if (pointerRef.current.active) {
            const dx = mx - x;
            const dy = my - y;
            const dist = Math.hypot(dx, dy);
            const influence = Math.max(0, 1 - dist / 190);
            const targetAngle = Math.atan2(dy, dx);
            angle = baseAngle * (1 - influence) + targetAngle * influence;
            strength = 0.35 + influence * 0.65;
          }

          const len = 11 + strength * 7;
          const ex = x + Math.cos(angle) * len;
          const ey = y + Math.sin(angle) * len;

          ctx.strokeStyle =
            strength > 0.55
              ? `rgba(59, 130, 246, ${0.45 + strength * 0.5})`
              : `rgba(161, 161, 170, ${0.22 + strength * 0.25})`;
          ctx.lineWidth = strength > 0.55 ? 1.75 : 1.15;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          ctx.fillStyle = strength > 0.55 ? '#60a5fa' : 'rgba(244, 244, 245, 0.35)';
          ctx.beginPath();
          ctx.arc(ex, ey, strength > 0.55 ? 2.2 : 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const renderFrame = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);
      drawGrid(w, h);

      if (mode === 'harmonics') drawHarmonics(w, h, time);
      else if (mode === 'geodesic') drawGeodesic(w, h, time);
      else drawLattice(w, h, time);

      if (isPlaying && !shouldReduceMotion) {
        time += 0.018;
        animationFrameId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [mode, isPlaying, phaseResetKey, shouldReduceMotion]);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-[#0B0B0E]"
    >
      {/* Top Interactive Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 px-5 py-3.5">
        <div
          role="tablist"
          aria-label="Mathematical visualizer modes"
          className="inline-flex items-center gap-1 rounded-lg bg-[#141418] p-1 border border-zinc-800/80"
        >
          {STAGE_MODES.map((item) => {
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  active ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? 'Pause mathematical animation' : 'Play mathematical animation'}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-[#141418] p-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setPhaseResetKey((k) => k + 1)}
            aria-label="Reset simulation phase"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-[#141418] p-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive HTML5 Canvas Stage */}
      <div
        className="relative flex-1 min-h-[320px] sm:min-h-[360px] cursor-crosshair"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          pointerRef.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
            active: true,
          };
        }}
        onMouseLeave={() => {
          pointerRef.current.active = false;
        }}
      >
        <canvas
          ref={canvasRef}
          aria-label={`Interactive ${currentMeta.label} mathematical visualization`}
          className="block h-full w-full min-h-[320px] sm:min-h-[360px]"
        />

        {/* Precision Corner Reticle Marks */}
        <span aria-hidden="true" className="pointer-events-none absolute top-3 left-3 font-mono text-xs text-zinc-600 select-none">
          +
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute top-3 right-3 font-mono text-xs text-zinc-600 select-none">
          +
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs text-zinc-600 select-none">
          +
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 font-mono text-xs text-zinc-600 select-none">
          +
        </span>
      </div>

      {/* Bottom KaTeX / LaTeX Mathematical Equation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800/80 bg-[#08080A] px-5 py-4 overflow-x-auto">
        <div className="text-sm text-zinc-200">
          <MathTex tex={currentMeta.tex} />
        </div>
        <div className="text-xs text-blue-400 shrink-0">
          <MathTex tex={currentMeta.symbolsTex} />
        </div>
      </div>
    </motion.div>
  );
};
