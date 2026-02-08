"use client";

import { useState, useEffect } from "react";
import { createChat, listChats } from "@/lib/chat-api";
import AgentChatModal, { type Project } from "./AgentChatModal";

function chatToProject(chat: { id: string; title: string }): Project {
  return {
    id: chat.id,
    title: chat.title,
    description: "",
    status: "active",
  };
}

export type ResearchParams = { topic: string; repo_name?: string };

export default function ProjectsWithChat() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [researchParams, setResearchParams] = useState<ResearchParams | null>(
    null,
  );

  const [researchModalOpen, setResearchModalOpen] = useState(false);
  const [researchTopic, setResearchTopic] = useState("");
  const [researchRepoName, setResearchRepoName] = useState("");
  const [researchSubmitting, setResearchSubmitting] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listChats()
      .then((chats) => {
        if (!cancelled) setProjects(chats.map(chatToProject));
      })
      .catch((e) => {
        if (!cancelled) setProjectsError(e instanceof Error ? e.message : "Failed to load projects");
      })
      .finally(() => {
        if (!cancelled) setProjectsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  function openChat(project: Project) {
    setResearchParams(null);
    setSelectedProject(project);
    setModalOpen(true);
  }

  async function startResearchProject() {
    const topic = researchTopic.trim();
    if (!topic) {
      setResearchError("Enter a research topic.");
      return;
    }
    setResearchSubmitting(true);
    setResearchError(null);
    try {
      const chat = await createChat(`Research: ${topic}`);
      const project = chatToProject(chat);
      setSelectedProject(project);
      setResearchParams({
        topic,
        repo_name: researchRepoName.trim() || undefined,
      });
      setResearchModalOpen(false);
      setModalOpen(true);
      setResearchTopic("");
      setResearchRepoName("");
      setProjects((prev) => [project, ...prev]);
    } catch (e) {
      setResearchError(
        e instanceof Error ? e.message : "Failed to create chat",
      );
    } finally {
      setResearchSubmitting(false);
    }
  }

  return (
    <>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-full border border-tron-blue/30 bg-tron-panel/80 px-4 py-2 text-xs text-gray-400 shadow-tron-glow-sm backdrop-blur-sm">
          {projectsLoading ? (
            <span>Loading…</span>
          ) : projectsError ? (
            <span className="text-amber-400">{projectsError}</span>
          ) : (
            <>
              <span className="text-tron-blue">{projects.length} projects</span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setResearchModalOpen(true)}
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-tron-blue/60 bg-tron-blue/5 px-4 py-2.5 text-sm font-medium text-tron-blue shadow-tron-glow-sm transition-all duration-200 hover:border-tron-blue hover:bg-tron-blue/10 hover:shadow-tron-glow sm:min-h-0 sm:min-w-0"
        >
          <PlusIcon className="h-5 w-5 shrink-0" />
          <span>New Research Project</span>
        </button>
      </div>

      {/* New Research Project modal */}
      {researchModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={() => !researchSubmitting && setResearchModalOpen(false)}
            aria-hidden
          />
          <div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-tron-blue/30 bg-tron-panel p-5 shadow-tron-glow"
            role="dialog"
            aria-modal="true"
            aria-labelledby="research-modal-title"
          >
            <h2
              id="research-modal-title"
              className="mb-4 font-semibold text-white"
            >
              New Research Project
            </h2>
            <p className="mb-4 text-sm text-gray-400">
              Create a marimo notebook that evaluates a trading signal. The
              agent will create a repo under atium-research and stream progress
              here.
            </p>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-300">
                Research topic / signal
              </label>
              <input
                type="text"
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                placeholder="e.g. Short Term Reversal"
                className="rounded-lg border border-gray-700 bg-tron-black px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-tron-blue/50 focus:outline-none focus:ring-1 focus:ring-tron-blue/50"
                disabled={researchSubmitting}
              />
              <label className="text-sm font-medium text-gray-300">
                Repository name{" "}
                <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="text"
                value={researchRepoName}
                onChange={(e) => setResearchRepoName(e.target.value)}
                placeholder="e.g. at-research-reversal-1"
                className="rounded-lg border border-gray-700 bg-tron-black px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-tron-blue/50 focus:outline-none focus:ring-1 focus:ring-tron-blue/50"
                disabled={researchSubmitting}
              />
              {researchError && (
                <p className="text-xs text-red-400">{researchError}</p>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  !researchSubmitting && setResearchModalOpen(false)
                }
                className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={startResearchProject}
                disabled={researchSubmitting || !researchTopic.trim()}
                className="rounded-lg border border-tron-blue/60 bg-tron-blue/10 px-4 py-2 text-sm font-medium text-tron-blue hover:bg-tron-blue/20 disabled:opacity-50"
              >
                {researchSubmitting ? "Starting…" : "Start Research"}
              </button>
            </div>
          </div>
        </>
      )}
      {!projectsLoading && !projectsError && projects.length === 0 && (
        <p className="text-center text-sm text-gray-500">No projects yet. Create one with New Research Project.</p>
      )}
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
                <p className="mt-1 text-sm text-gray-400">
                  {project.description}
                </p>
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
                      project.status === "active"
                        ? "text-tron-blue"
                        : "text-tron-orange"
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
        researchParams={researchParams}
        onResearchStarted={() => setResearchParams(null)}
      />
    </>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
