"use client";

import { useState } from "react";
import AgentChatModal, { type Project } from "./AgentChatModal";

const projects: Project[] = [
  {
    id: "1",
    title: "Momentum Strategy",
    description:
      "Multi-factor momentum trading strategy analyzing price trends and volume patterns across equity markets.",
    status: "active",
  },
  {
    id: "2",
    title: "Signal Detection",
    description:
      "Real-time signal detection and classification for alpha generation using ML-based pattern recognition.",
    status: "active",
  },
  {
    id: "3",
    title: "Mean Reversion Alpha",
    description:
      "Statistical arbitrage strategy identifying short-term mean reversion opportunities across correlated instruments.",
    status: "active",
  },
  {
    id: "4",
    title: "Volatility Harvesting",
    description:
      "Options-based volatility surface trading and variance premium capture across indices and single names.",
    status: "paused",
  },
  {
    id: "5",
    title: "Sentiment Analysis",
    description:
      "Alternative data pipeline combining news, social sentiment, and earnings call signals for directional bias.",
    status: "active",
  },
  {
    id: "6",
    title: "Cross-Asset Correlation",
    description:
      "Dynamic correlation and regime detection for portfolio construction and risk allocation.",
    status: "active",
  },
];

const activeCount = projects.filter((p) => p.status === "active").length;

export default function ProjectsWithChat() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function openChat(project: Project) {
    setSelectedProject(project);
    setModalOpen(true);
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-full border border-tron-blue/30 bg-tron-panel/80 px-4 py-2 text-xs text-gray-400 shadow-tron-glow-sm backdrop-blur-sm">
          <span className="text-tron-blue">{projects.length} projects</span>
          <span className="text-gray-600">·</span>
          <span>{activeCount} active</span>
        </div>
        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-tron-blue/60 bg-tron-blue/5 px-4 py-2.5 text-sm font-medium text-tron-blue shadow-tron-glow-sm transition-all duration-200 hover:border-tron-blue hover:bg-tron-blue/10 hover:shadow-tron-glow sm:min-h-0 sm:min-w-0"
        >
          <PlusIcon className="h-5 w-5 shrink-0" />
          <span>New Project</span>
        </button>
      </div>
      <ul className="flex flex-col gap-3">
        {projects.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              onClick={() => openChat(project)}
              className="group relative flex w-full flex-col gap-3 rounded-lg border border-tron-blue/20 bg-tron-panel/50 px-4 py-4 text-left transition-all duration-200 hover:border-tron-blue/50 hover:shadow-tron-glow-sm sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-white">{project.title}</h2>
                <p className="mt-1 text-sm text-gray-400">{project.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      project.status === "active"
                        ? "bg-tron-blue shadow-tron-glow-sm animate-tron-pulse"
                        : "bg-tron-orange"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      project.status === "active" ? "text-tron-blue" : "text-tron-orange"
                    }`}
                  >
                    {project.status === "active" ? "Active" : "Paused"}
                  </span>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-tron-blue/20 text-tron-blue/60 opacity-0 transition-all group-hover:opacity-100 group-hover:border-tron-blue/40">
                  <ChevronIcon className="h-4 w-4" />
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <AgentChatModal
        project={selectedProject}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
