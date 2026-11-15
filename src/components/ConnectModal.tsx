import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Copy, Link2, Mail, X } from 'lucide-react';
import type { PortfolioProfile } from '../data/portfolio';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PortfolioProfile;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, profile }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  const githubDisplay = profile.github ? profile.github.replace(/^https?:\/\/(www\.)?/, '') : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#111113] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-zinc-400">
              {profile.name} · {profile.role}
            </p>
            <h2
              id="connect-modal-title"
              className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-zinc-100"
            >
              Connect
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close connect dialog"
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {profile.email && (
            <div className="rounded-xl border border-zinc-800 bg-[#050505] p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">Email</p>
                <p className="mt-0.5 truncate text-sm font-medium text-zinc-100">{profile.email}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopyValue(profile.email as string)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#111113] px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {profile.github && githubDisplay && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-800 bg-[#050505] p-4 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors duration-150"
            >
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">GitHub</p>
                <p className="mt-0.5 truncate font-mono text-sm font-medium text-blue-400">
                  {githubDisplay}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-zinc-400 shrink-0" aria-hidden="true" />
            </a>
          )}

          {!profile.email && !profile.github && (
            <p className="text-sm leading-relaxed text-zinc-400">
              No contact email or social links have been added yet.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {profile.email ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Close
              </button>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111113]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>Open Email Client</span>
              </a>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleCopyValue(window.location.href)}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#050505] px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Link2 className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                <span>{copied ? 'Page Link Copied' : 'Copy Page Link'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
