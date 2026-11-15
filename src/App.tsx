import { useState } from 'react';
import { ConnectModal } from './components/ConnectModal';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProjectsSection } from './components/ProjectsSection';
import { portfolioProfile } from './data/portfolio';

export default function App() {
  const [connectOpen, setConnectOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col">
      <Navbar brandName={portfolioProfile.name} onOpenConnect={() => setConnectOpen(true)} />

      <main className="flex-1">
        <HeroSection profile={portfolioProfile} onOpenConnect={() => setConnectOpen(true)} />
        <ProjectsSection projects={portfolioProfile.projects} />
      </main>

      <footer className="bg-[#050505]">
        <div className="mx-auto flex flex-wrap max-w-6xl items-center justify-between gap-4 px-6 py-6 text-xs text-zinc-500 sm:px-8">
          <span>
            © {new Date().getFullYear()} {portfolioProfile.name} · {portfolioProfile.role}
          </span>
          <div className="flex items-center gap-5 font-mono">
            {portfolioProfile.email && (
              <a
                href={`mailto:${portfolioProfile.email}`}
                className="text-zinc-400 hover:text-zinc-100 transition-colors duration-150"
              >
                {portfolioProfile.email}
              </a>
            )}
            {portfolioProfile.github && (
              <a
                href={portfolioProfile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </footer>

      <ConnectModal
        isOpen={connectOpen}
        onClose={() => setConnectOpen(false)}
        profile={portfolioProfile}
      />
    </div>
  );
}
