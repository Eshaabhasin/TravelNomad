import type {
  RecommendationRequest,
  Recommendations,
  ChatRequest,
  ChatResponse,
  ApiError,
} from "@/types";

const BASE_URL = "/api";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      error: "Network error",
    }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetch AI recommendations for a location.
 * Calls the secure server-side API route — Gemini key never exposed client-side.
 */
export async function fetchRecommendations(
  payload: RecommendationRequest
): Promise<Recommendations> {
  const res = await fetch(`${BASE_URL}/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<Recommendations>(res);
}

/**
 * Send a chat message to the AI assistant.
 * Multi-turn conversation with history passed from the client.
 */
export async function sendChatMessage(
  payload: ChatRequest
): Promise<ChatResponse> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ChatResponse>(res);
}
