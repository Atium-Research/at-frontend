"use client";

import { useState, useRef, useEffect } from "react";
import { agentChat } from "@/lib/agent";

export type Project = {
  id: string;
  title: string;
  description: string;
  status: "active" | "paused";
};

type Message = { role: "user" | "agent"; content: string };

type Props = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
};

export default function AgentChatModal({ project, open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMessages([]);
      setInput("");
      setError(null);
    }
  }, [open, project?.id]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || !project) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    setError(null);
    try {
      const response = await agentChat(text);
      setMessages((prev) => [...prev, { role: "agent", content: response }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setMessages((prev) => [...prev, { role: "agent", content: `Error: ${message}` }]);
    } finally {
      setLoading(false);
    }
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
        className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-tron-blue/30 bg-tron-panel shadow-tron-glow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-modal-title"
      >
        <div className="flex items-center justify-between border-b border-gray-800/80 px-4 py-3">
          <h2 id="chat-modal-title" className="font-semibold text-white">
            {project?.title ?? "Agent"}
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
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-4 py-3"
          style={{ minHeight: "200px", maxHeight: "50vh" }}
        >
          {messages.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              Send a message to chat with the agent.
            </p>
          )}
          <ul className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <li
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-tron-blue/20 text-tron-blue border border-tron-blue/30"
                      : "bg-gray-800/80 text-gray-200 border border-gray-700/50"
                  }`}
                >
                  {m.content}
                </span>
              </li>
            ))}
            {loading && (
              <li className="flex justify-start">
                <span className="rounded-lg border border-gray-700/50 bg-gray-800/80 px-3 py-2 text-sm text-gray-400">
                  …
                </span>
              </li>
            )}
          </ul>
          {error && (
            <p className="mt-2 text-center text-xs text-red-400">{error}</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="border-t border-gray-800/80 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message the agent…"
              className="min-h-11 flex-1 rounded-lg border border-gray-700 bg-tron-black px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-tron-blue/50 focus:outline-none focus:ring-1 focus:ring-tron-blue/50"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg border border-tron-blue/60 bg-tron-blue/10 px-4 py-2 text-sm font-medium text-tron-blue transition-colors hover:border-tron-blue hover:bg-tron-blue/20 disabled:opacity-50"
            >
              Send
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
