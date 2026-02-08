/**
 * at-backend integration: REST + WebSocket chat.
 *
 * NEXT_PUBLIC_API_URL must be set at BUILD time (Next.js bakes it into the client).
 * - No trailing slash: use https://...railway.app not https://...railway.app/
 * - Local:   http://localhost:8000  → ws://localhost:8000/ws
 * - Production: https://at-backend-production-8139.up.railway.app → wss://.../ws
 *
 * Use wss:// in production (TLS). Do not use ws:// on a page served over https.
 * Backend must allow your frontend origin in CORS / WebSocket (e.g. https://atiumresearch.com).
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
  .replace(/\/$/, "");
const API_PREFIX = (process.env.NEXT_PUBLIC_API_PREFIX ?? "/api").replace(/\/$/, "");

function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${API_PREFIX}${p}`;
}

/** WebSocket URL: same host as REST, path /ws, secure scheme (https → wss). */
export function getWsUrl(): string {
  if (!API_BASE) return "";
  // https → wss, http → ws; then append /ws
  const wsBase = API_BASE.replace(/^http/, "ws");
  return `${wsBase}/ws`;
}

export function getApiBase(): string {
  return API_BASE;
}

// --- Types (match at-backend) ---

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// --- REST ---

export async function createChat(title?: string): Promise<Chat> {
  const body = title != null && title !== "" ? { title } : {};
  const res = await fetch(apiUrl("/chats"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Create chat failed: ${res.status}`);
  }
  return res.json();
}

export async function listChats(): Promise<Chat[]> {
  const res = await fetch(apiUrl("/chats"));
  if (!res.ok) throw new Error(await res.text() || `List chats failed: ${res.status}`);
  return res.json();
}

export async function getChat(id: string): Promise<Chat> {
  const res = await fetch(apiUrl(`/chats/${id}`));
  if (!res.ok) throw new Error(await res.text() || `Get chat failed: ${res.status}`);
  return res.json();
}

export async function getChatMessages(id: string): Promise<ChatMessage[]> {
  const res = await fetch(apiUrl(`/chats/${id}/messages`));
  if (!res.ok) throw new Error(await res.text() || `Get messages failed: ${res.status}`);
  return res.json();
}

export async function deleteChat(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/chats/${id}`), { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text() || `Delete chat failed: ${res.status}`);
}

// --- WebSocket message types (server → client) ---

export type IncomingMessage =
  | { type: "connected"; message?: string }
  | { type: "history"; messages: ChatMessage[]; chatId: string }
  | { type: "user_message"; content: string; chatId: string }
  | { type: "assistant_message"; content: string; chatId: string }
  | { type: "agent_status"; message: string; chatId: string }
  | { type: "tool_use"; toolName?: string; toolId?: string; toolInput?: unknown; chatId: string }
  | { type: "result"; success: boolean; chatId: string; cost?: number; duration_ms?: number }
  | { type: "error"; error: string; chatId: string };

/**
 * One JSON object per WebSocket message. Never concatenate multiple JSON objects
 * in one send. Backend processes one message at a time.
 */

/** Client → server: subscribe to a chat. Send exactly once after connection open. */
export function makeSubscribeMessage(chatId: string): string {
  return JSON.stringify({ type: "subscribe", chatId });
}

/** Client → server: send user message */
export function makeChatMessage(chatId: string, content: string): string {
  return JSON.stringify({ type: "chat", chatId, content });
}

/**
 * Client → server: start Research Project Agent.
 * Send only after subscribe has been sent (same tick is fine). One message only.
 * Payload must have: type "research", chatId (same as subscribe), topic, repo_name (string | null).
 */
export function makeResearchMessage(
  chatId: string,
  topic: string,
  repoName?: string | null
): string {
  const payload = {
    type: "research" as const,
    chatId,
    topic,
    repo_name: repoName === undefined || repoName === "" ? null : repoName,
  };
  return JSON.stringify(payload);
}
