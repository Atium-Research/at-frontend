/**
 * at-backend integration: REST + WebSocket chat.
 *
 * Set NEXT_PUBLIC_API_URL to the backend origin only (no path):
 * - Local:   http://localhost:8000
 * - Railway: https://at-backend-production-8139.up.railway.app
 *
 * Do not use a proxied URL like https://yoursite.com/backend — call the backend
 * origin directly so requests go to e.g. ...railway.app/api/chats.
 * The backend must allow CORS from your frontend origin.
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000")
  .replace(/\/$/, "");
const API_PREFIX = (process.env.NEXT_PUBLIC_API_PREFIX ?? "/api").replace(/\/$/, "");

function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${API_PREFIX}${p}`;
}

export function getWsUrl(): string {
  if (!API_BASE) return "";
  const protocol = API_BASE.startsWith("https") ? "wss" : "ws";
  const host = API_BASE.replace(/^https?:\/\//, "");
  return host ? `${protocol}://${host}/ws` : "";
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

/** Client → server: subscribe to a chat */
export function makeSubscribeMessage(chatId: string): string {
  return JSON.stringify({ type: "subscribe", chatId });
}

/** Client → server: send user message */
export function makeChatMessage(chatId: string, content: string): string {
  return JSON.stringify({ type: "chat", chatId, content });
}
