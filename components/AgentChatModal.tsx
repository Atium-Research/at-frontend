"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  getWsUrl,
  makeSubscribeMessage,
  makeChatMessage,
  type IncomingMessage,
  type ChatMessage as ApiChatMessage,
} from "@/lib/chat-api";

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

function chatMessagesToDisplay(messages: ApiChatMessage[]): Message[] {
  return (messages ?? []).map((m) => ({
    role: m.role === "assistant" ? "agent" : "user",
    content: m.content ?? "",
  }));
}

export default function AgentChatModal({ project, open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "open" | "closed" | "error"
  >("idle");
  const [agentStatus, setAgentStatus] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const closeWs = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionStatus("closed");
  }, []);

  useEffect(() => {
    if (!open || !project) {
      setMessages([]);
      setInput("");
      setError(null);
      setChatId(null);
      setAgentStatus(null);
      closeWs();
      return;
    }

    let cancelled = false;
    const wsUrl = getWsUrl();

    if (!wsUrl) {
      setError("NEXT_PUBLIC_API_URL is not set. WebSocket cannot connect.");
      setConnectionStatus("error");
      return;
    }

    // Production (HTTPS) but bundle has localhost → env was not set at build time
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      wsUrl.startsWith("ws://localhost")
    ) {
      setError(
        "This build was compiled without NEXT_PUBLIC_API_URL for production. Set NEXT_PUBLIC_API_URL=https://at-backend-production-8139.up.railway.app (or your backend URL) in your hosting platform's environment variables (e.g. Vercel → Project → Settings → Environment Variables), then redeploy. The variable is inlined at build time.",
      );
      setConnectionStatus("error");
      return;
    }

    setConnectionStatus("connecting");
    setError(null);
    setChatId(project.id);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (cancelled || !wsRef.current) return;
      setConnectionStatus("open");
      ws.send(makeSubscribeMessage(project.id));
    };

    ws.onmessage = (event) => {
      if (cancelled) return;
      try {
        const data = JSON.parse(event.data) as IncomingMessage;
        switch (data.type) {
          case "connected":
            break;
          case "history":
            setMessages(chatMessagesToDisplay(data.messages ?? []));
            break;
          case "user_message":
            break;
          case "assistant_message": {
            const delta = (data.content ?? "") as string;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "agent") {
                return [
                  ...prev.slice(0, -1),
                  { role: "agent", content: last.content + delta },
                ];
              }
              return [...prev, { role: "agent", content: delta }];
            });
            setLoading(false);
            break;
          }
          case "agent_status":
            setAgentStatus(data.message ?? null);
            break;
          case "tool_use":
            break;
          case "result":
            setAgentStatus(null);
            setLoading(false);
            break;
          case "error":
            setAgentStatus(null);
            setError(data.error ?? "Error");
            setLoading(false);
            break;
          default:
            break;
        }
      } catch {}
    };

    ws.onclose = (event) => {
      if (!cancelled) {
        setConnectionStatus("closed");
        if (event.code !== 1000 && event.code !== 1005) {
          setConnectionStatus("error");
          let hint = event.reason;
          if (!hint) {
            if (event.code === 1006) {
              hint =
                "Cannot reach server. If the URL looks correct, the backend may be rejecting the connection: ensure your frontend origin (e.g. https://atiumresearch.com) is in the backend's ALLOWED_ORIGINS / CORS config for WebSocket.";
            } else if (event.code === 1008) {
              hint = "Backend rejected the connection (policy). Add your site's origin to the backend ALLOWED_ORIGINS.";
            } else {
              hint = `WebSocket closed (${event.code}).`;
            }
          }
          setError(hint);
        }
      }
    };

    ws.onerror = () => {
      if (!cancelled) {
        setConnectionStatus("error");
        setError(
          "WebSocket error. Check backend is running and NEXT_PUBLIC_API_URL is correct.",
        );
      }
    };

    return () => {
      cancelled = true;
      closeWs();
    };
  }, [open, project?.id, closeWs]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (
      !text ||
      loading ||
      !chatId ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    )
      return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    setError(null);
    wsRef.current.send(makeChatMessage(chatId, text));
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
          <div className="flex items-center gap-2">
            <h2 id="chat-modal-title" className="font-semibold text-white">
              {project?.title ?? "Agent"}
            </h2>
            {connectionStatus === "connecting" && (
              <span className="text-xs text-gray-500">Connecting…</span>
            )}
            {connectionStatus === "open" && (
              <span
                className="h-2 w-2 rounded-full bg-tron-blue shadow-tron-glow-sm"
                title="Connected"
              />
            )}
          </div>
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
          {messages.length === 0 && connectionStatus !== "connecting" && (
            <p className="text-center text-sm text-gray-500">
              {connectionStatus === "open"
                ? "Send a message to chat with the agent."
                : connectionStatus === "error"
                  ? error
                    ? `Connection failed: ${error} Close and try again.`
                    : "Connection failed. Close and try again."
                  : "Send a message to chat with the agent."}
            </p>
          )}
          <ul className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <li
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
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
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-800/80 p-3"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message the agent…"
              className="min-h-11 flex-1 rounded-lg border border-gray-700 bg-tron-black px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-tron-blue/50 focus:outline-none focus:ring-1 focus:ring-tron-blue/50"
              disabled={loading || connectionStatus !== "open"}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || connectionStatus !== "open"}
              className="rounded-lg border border-tron-blue/60 bg-tron-blue/10 px-4 py-2 text-sm font-medium text-tron-blue transition-colors hover:border-tron-blue hover:bg-tron-blue/20 disabled:opacity-50"
            >
              Send
            </button>
          </div>
          {agentStatus && (
            <p className="mt-2 text-xs text-tron-blue/80">
              Agent: {agentStatus}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
