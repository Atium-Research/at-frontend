"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  getWsUrl,
  makeSubscribeMessage,
  makeChatMessage,
  makeResearchMessage,
  type IncomingMessage,
  type ChatMessage as ApiChatMessage,
} from "@/lib/chat-api";

export type Project = {
  id: string;
  title: string;
  description: string;
  status: "active" | "paused";
};

type Message = { role: "user" | "agent" | "tool"; content: string };

type Props = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  /** When set, send a research start message once the WebSocket is open */
  researchParams?: { topic: string; repo_name?: string } | null;
  onResearchStarted?: () => void;
};

function chatMessagesToDisplay(messages: ApiChatMessage[]): Message[] {
  return (messages ?? []).map((m) => ({
    role: m.role === "assistant" ? "agent" : "user",
    content: m.content ?? "",
  }));
}

export default function AgentChatModal({
  project,
  open,
  onClose,
  researchParams,
  onResearchStarted,
}: Props) {
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
  const researchSentRef = useRef(false);

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
      researchSentRef.current = false;
      closeWs();
      return;
    }
    researchSentRef.current = false;

    const chatIdForSession = project.id;
    setChatId(chatIdForSession);
    setConnectionStatus("connecting");
    setError(null);

    let cancelled = false;
    const wsUrl = getWsUrl();
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      if (cancelled || !wsRef.current) return;
      setConnectionStatus("open");
      // Send exactly one message: subscribe. Do not send anything else in this tick.
      ws.send(makeSubscribeMessage(chatIdForSession));
    };

    ws.onmessage = (event) => {
      if (cancelled) return;
      try {
        const data = JSON.parse(event.data) as IncomingMessage;
        // Do not send any WebSocket message from here (e.g. no second subscribe on history).
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
          case "tool_use": {
            const name = data.toolName ?? "Tool";
            const input = data.toolInput as Record<string, unknown> | undefined;
            let line = name;
            if (name === "Bash" && input?.command)
              line = `Bash: $ ${String(input.command).trim().split("\n")[0]}`;
            else if ((name === "Write" || name === "Edit") && input?.path)
              line = `${name}: ${input.path}`;
            else if (name === "Read" && input?.path)
              line = `Read: ${input.path}`;
            else if (input && Object.keys(input).length > 0)
              line = `${name}: ${JSON.stringify(input).slice(0, 80)}…`;
            setMessages((prev) => [
              ...prev,
              { role: "tool", content: line },
            ]);
            break;
          }
          case "result": {
            setAgentStatus(null);
            setLoading(false);
            const res = data as { success: boolean; cost?: number; duration_ms?: number };
            const parts = [res.success ? "Completed" : "Failed"];
            if (res.cost != null) parts.push(`$${Number(res.cost).toFixed(4)}`);
            if (res.duration_ms != null) parts.push(`${res.duration_ms}ms`);
            setMessages((prev) => [
              ...prev,
              { role: "tool", content: parts.join(" · ") },
            ]);
            break;
          }
          case "error": {
            setAgentStatus(null);
            const errMsg = data.error ?? "Error";
            setError(
              errMsg === "Invalid message format"
                ? "Invalid message format. Ensure the backend supports the research flow (WebSocket type: research)."
                : errMsg,
            );
            setLoading(false);
            break;
          }
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
          setError(
            event.reason ||
              (event.code === 1006
                ? "Cannot reach server. Is the backend running at NEXT_PUBLIC_API_URL?"
                : `WebSocket closed (${event.code})`),
          );
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
  }, [open, project?.id, project?.title, closeWs]);

  // Send research only after subscribe has been sent (connectionStatus "open").
  // One JSON message only; no extra subscribe or other message after this.
  useEffect(() => {
    if (
      connectionStatus !== "open" ||
      !chatId ||
      !researchParams ||
      researchSentRef.current ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    )
      return;
    researchSentRef.current = true;
    const payload = makeResearchMessage(
      chatId,
      researchParams.topic,
      researchParams.repo_name,
    );
    wsRef.current.send(payload);
    onResearchStarted?.();
    setLoading(true);
    setError(null);
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `Research: ${researchParams.topic}${researchParams.repo_name ? ` (repo: ${researchParams.repo_name})` : ""}`,
      },
    ]);
  }, [connectionStatus, chatId, researchParams, onResearchStarted]);

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
                      : m.role === "tool"
                        ? "border border-amber-500/20 bg-amber-500/5 text-amber-200/90 font-mono text-xs"
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
