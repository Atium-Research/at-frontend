const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export type ChatRequest = { message: string };
export type ChatResponse = { response: string };

export async function agentChat(message: string): Promise<string> {
  const res = await fetch(`${API_BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message } satisfies ChatRequest),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Agent chat failed: ${res.status}`);
  }
  const data: ChatResponse = await res.json();
  return data.response;
}
