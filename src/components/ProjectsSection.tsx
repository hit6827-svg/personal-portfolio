import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import type { ProjectItem } from '../data/portfolio';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Web Development'>('all');
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const handleCopyUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrlId(id);
      window.setTimeout(() => setCopiedUrlId(null), 2000);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  return (
    <section id="projects" className="relative border-b border-zinc-800/80 bg-[#050505]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:py-24">
        {/* Section Header + Category Filter */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">
              <span className="font-mono text-blue-400 mr-2" aria-hidden="true">
                01.
              </span>
              <span>Selected Works</span>
              <span aria-hidden="true" className="mx-2 text-zinc-700">
                ·
              </span>
              <span>Web Development</span>
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl text-balance">
              Web Development Projects
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter projects by discipline"
            className="inline-flex items-center gap-1 self-start rounded-lg border border-zinc-800 bg-[#0B0B0E] p-1 sm:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'Web Development'}
              onClick={() => setSelectedCategory('Web Development')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                selectedCategory === 'Web Development'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Web Development ({projects.filter((p) => p.category === 'Web Development').length})
            </button>
          </div>
        </div>

        {/* Clean Project List */}
        <div className="mt-10 space-y-6">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-zinc-800 bg-[#0B0B0E] p-6 sm:p-8 transition-colors duration-150 hover:border-zinc-700"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-medium text-zinc-400">
                    <span className="font-mono text-blue-400 mr-2 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{project.category}</span>
                  </p>

                  <h3 className="mt-2.5 font-display text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
                    {project.title}
                  </h3>

                  <p className="mt-2.5 text-base leading-relaxed text-zinc-400">
                    {project.description}
                  </p>

                  {project.techStack && project.techStack.length > 0 && (
                    <p className="mt-4 font-mono text-xs text-zinc-500">
                      {project.techStack.join(' · ')}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:bg-blue-700 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0E]"
                  >
                    <span>Launch {project.title}</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyUrl(project.id, project.liveUrl)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-200 bg-[#111114] border border-zinc-800 rounded-lg hover:bg-zinc-800/80 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0E]"
                  >
                    {copiedUrlId === project.id ? (
                      <>
                        <Check className="h-4 w-4 text-blue-500" aria-hidden="true" />
                        <span>URL Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                        <span>Copy App Link</span>
                      </>
                    )}
                  </button>

                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-150 whitespace-nowrap shrink-0"
                    >
                      <span>Source Code</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
