import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import type { PortfolioProfile } from '../data/portfolio';
import { MathTex } from './MathTex';
import { MathTechStage } from './MathTechStage';

interface HeroSectionProps {
  profile: PortfolioProfile;
  onOpenConnect: () => void;
}

const MATH_SYMBOLS = ['∑', '∫', '∇', '∂', 'λ', 'θ', 'Δ', 'π', '∞', '⊕', '⊗', '≈'];

const FLOATING_GLYPHS = [
  { symbol: '∇ × F', top: '10%', left: '4%', delay: 0 },
  { symbol: '∑ aₙ', top: '18%', right: '5%', delay: 0.8 },
  { symbol: '∂/∂t', bottom: '22%', left: '2%', delay: 1.4 },
  { symbol: 'λ ∈ ℝ', bottom: '16%', right: '4%', delay: 0.4 },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, onOpenConnect }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const metadataItems = [
    profile.role,
    `${profile.yearsExperience} Years`,
    profile.focus,
    profile.location,
  ].filter((item): item is string => Boolean(item));

  const githubHandle = profile.github ? profile.github.replace(/^https?:\/\/(www\.)?/, '') : null;

  const handleCopyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      onOpenConnect();
    }
  };

  return (
    <section id="overview" className="relative overflow-hidden border-b border-zinc-800/80">
      {/* Architectural Studio Coordinate Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 studio-grid-bg [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]"
      />

      {/* Subtle Ambient Mathematical Symbol Accents */}
      {!shouldReduceMotion &&
        FLOATING_GLYPHS.map((glyph) => (
          <motion.span
            key={glyph.symbol}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.14, 0.28, 0.14],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              delay: glyph.delay,
              ease: 'easeInOut',
            }}
            style={{
              top: glyph.top,
              left: glyph.left,
              right: glyph.right,
              bottom: glyph.bottom,
            }}
            className="pointer-events-none hidden xl:block absolute font-mono text-xs text-zinc-600 select-none"
          >
            {glyph.symbol}
          </motion.span>
        ))}

      <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-16 sm:px-8 lg:pt-20 lg:pb-24">
        {/* Two-Column Hero Split */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-stretch">
          {/* Left Column: Animated Typographic Hierarchy */}
          <div className="flex flex-col justify-between lg:col-span-6 py-2">
            <div>
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-medium text-zinc-400"
              >
                {metadataItems.map((item, idx) => (
                  <React.Fragment key={item}>
                    {idx > 0 && (
                      <span aria-hidden="true" className="text-zinc-700">
                        ·
                      </span>
                    )}
                    <span>{item}</span>
                  </React.Fragment>
                ))}
              </motion.div>

              <motion.h1
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 font-display text-5xl font-semibold tracking-tight text-zinc-100 sm:text-6xl lg:text-[4.25rem] lg:leading-[1.04] text-balance"
              >
                {profile.name}
              </motion.h1>

              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 font-display text-xl font-medium tracking-tight text-zinc-300 sm:text-2xl text-balance"
              >
                <span className="text-blue-400 font-mono text-lg mr-2" aria-hidden="true">
                  ∑
                </span>
                {profile.role} with{' '}
                <span className="font-mono text-zinc-100 tabular-nums">
                  {String(profile.yearsExperience).padStart(2, '0')}
                </span>{' '}
                years of exploration.
              </motion.p>

              {/* Editorial Note on Mathematical Fascination */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 rounded-xl border border-zinc-800/90 bg-[#0B0B0E] p-5"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                  <span className="font-medium text-zinc-400">Personal Note · Mathematics</span>
                  <span className="font-mono text-blue-400" aria-hidden="true">
                    π · ∫ · ∞
                  </span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
                  {profile.mathNote}
                </p>
              </motion.div>

              {/* Precision Geometric Divider Rule */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-7 h-px w-full origin-left bg-gradient-to-r from-blue-500/70 via-zinc-700 to-transparent"
              />

              {/* Typeset Mathematical Equations via KaTeX */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 grid grid-cols-3 gap-4 text-left"
              >
                <div className="space-y-1.5">
                  <div className="text-sm text-blue-400">
                    <MathTex tex={String.raw`\int_a^b f(x)\,dx`} />
                  </div>
                  <p className="text-xs text-zinc-500">Continuous curiosity</p>
                </div>
                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-200">
                    <MathTex tex={String.raw`\nabla \cdot \mathbf{F}`} />
                  </div>
                  <p className="text-xs text-zinc-500">Systems &amp; geometry</p>
                </div>
                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-200">
                    <MathTex tex={String.raw`\lim_{\Delta t \to \infty}`} />
                  </div>
                  <p className="text-xs text-zinc-500">Iterative craft</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 pt-7 border-t border-zinc-800/80 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:bg-blue-700 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                <span className="font-mono text-blue-200" aria-hidden="true">
                  ∑
                </span>
                <span>Explore Projects</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>

              {profile.email && (
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-200 bg-[#111113] border border-zinc-800 rounded-lg hover:bg-zinc-800/80 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-4 w-4 text-blue-500" aria-hidden="true" />
                      <span>Email Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                      <span>{profile.email}</span>
                    </>
                  )}
                </button>
              )}
            </motion.div>
          </div>

          {/* Right Column: Advanced Interactive Mathematical & Tech Stage */}
          <div id="visualizer" className="lg:col-span-6 flex">
            <MathTechStage />
          </div>
        </div>

        {/* Confirmed Profile Details Row */}
        <div
          id="details"
          className="mt-14 pt-10 border-t border-zinc-800 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-zinc-500">Identity</p>
            <p className="font-display text-xl font-medium tracking-tight text-zinc-100">
              {profile.name}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-zinc-500">Discipline</p>
            <p className="font-display text-xl font-medium tracking-tight text-zinc-100">
              {profile.role}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-zinc-500">Experience</p>
            <p className="font-mono text-xl font-medium tracking-tight text-zinc-100 tabular-nums">
              {String(profile.yearsExperience).padStart(2, '0')} Years
            </p>
          </div>

          {githubHandle && profile.github && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-zinc-500">GitHub</p>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline underline-offset-4 transition-colors duration-150"
              >
                <span className="truncate">{githubHandle}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Animated Mathematical & Technical Symbol Divider Ribbon */}
      <div className="border-t border-zinc-800/80 bg-[#08080A] py-3 overflow-hidden" aria-hidden="true">
        <motion.div
          className="flex w-max items-center gap-10 font-mono text-xs text-zinc-500"
          animate={shouldReduceMotion ? undefined : { x: ['0%', '-50%'] }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 28,
                  repeat: Infinity,
                  ease: 'linear',
                }
          }
        >
          {[0, 1].map((loopIndex) => (
            <div key={loopIndex} className="flex items-center gap-10 pr-10">
              {MATH_SYMBOLS.map((sym, index) => (
                <span key={`${loopIndex}-${index}`} className="flex items-center gap-10">
                  <span className="text-zinc-400">{sym}</span>
                  <span className="text-zinc-700">·</span>
                </span>
              ))}
              <span className="text-zinc-400">{profile.name}</span>
              <span className="text-zinc-700">·</span>
              <span className="text-blue-400">{profile.role}</span>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-400 tabular-nums">{profile.yearsExperience} Years</span>
              <span className="text-zinc-700">·</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
