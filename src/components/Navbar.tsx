import React from 'react';

interface NavbarProps {
  brandName: string;
  onOpenConnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ brandName, onOpenConnect }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#050505]/85 backdrop-blur-md border-b border-zinc-800/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4 sm:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-zinc-100 whitespace-nowrap shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
        >
          {brandName}
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          <a
            href="#overview"
            className="hover:text-zinc-100 hover:underline underline-offset-4 decoration-zinc-600 transition-colors duration-150 whitespace-nowrap shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            Overview
          </a>
          <a
            href="#visualizer"
            className="hover:text-zinc-100 hover:underline underline-offset-4 decoration-zinc-600 transition-colors duration-150 whitespace-nowrap shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            Visualizer
          </a>
          <a
            href="#projects"
            className="hover:text-zinc-100 hover:underline underline-offset-4 decoration-zinc-600 transition-colors duration-150 whitespace-nowrap shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            Projects
          </a>
          <button
            type="button"
            onClick={onOpenConnect}
            className="hover:text-zinc-100 hover:underline underline-offset-4 decoration-zinc-600 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            Connect
          </button>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenConnect}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:bg-blue-700 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </header>
  );
};
