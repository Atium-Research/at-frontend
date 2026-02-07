"use client";

import { useState, useEffect } from "react";

export type NewProjectData = {
  title: string;
  description: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: NewProjectData) => void;
};

export default function NewProjectModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onCreate({ title: trimmed, description: description.trim() });
    onClose();
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-tron-blue/30 bg-tron-panel p-5 shadow-tron-glow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="new-project-title" className="text-lg font-semibold text-white">
            New project
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800/50 hover:text-white"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="project-title" className="mb-1.5 block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              id="project-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Momentum Strategy"
              className="w-full rounded-lg border border-gray-700 bg-tron-black px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-tron-blue/50 focus:outline-none focus:ring-1 focus:ring-tron-blue/50"
              autoFocus
              required
            />
          </div>
          <div>
            <label htmlFor="project-description" className="mb-1.5 block text-sm font-medium text-gray-300">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project…"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-700 bg-tron-black px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-tron-blue/50 focus:outline-none focus:ring-1 focus:ring-tron-blue/50"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="rounded-lg border border-tron-blue/60 bg-tron-blue/10 px-4 py-2 text-sm font-medium text-tron-blue transition-colors hover:border-tron-blue hover:bg-tron-blue/20 disabled:opacity-50"
            >
              Create project
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
