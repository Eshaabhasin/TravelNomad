/**
 * Gemini API service — SERVER ONLY. Never import in client components.
 */
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import type { Recommendations, ChatRequest, ChatResponse } from "@/types";

function getClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set in .env.local");
  return new GoogleGenerativeAI(key);
}

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/** Generate location-based travel recommendations. Returns structured JSON. */
export async function generateRecommendations(
  lat: number,
  lng: number,
  preferences: string[],
  timeLimit = "2 hours"
): Promise<Recommendations> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1200,
    },
  });

  const prefText = preferences.length > 0 ? preferences.join(", ") : "general travel";

  const prompt = `You are an expert AI travel companion. A user clicked on the map at coordinates (${lat}, ${lng}).
  
User travel preferences: ${prefText}.
Time available: ${timeLimit}.

Generate 3 to 5 specific, real place recommendations near those coordinates.
Respond ONLY with a valid JSON object — no markdown, no extra text, just raw JSON.

Schema:
{
  "summary": "One engaging sentence describing the recommended itinerary",
  "places": [
    {
      "name": "Name of place",
      "reason": "Why it suits the user preferences",
      "rating": 4.5,
      "distance": "0.8 km",
      "category": "Café"
    }
  ],
  "routeStyle": "e.g. Scenic Walk",
  "estimatedTime": "e.g. ~90 minutes"
}`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  // Strip markdown code fences if Gemini wraps it
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  return JSON.parse(text) as Recommendations;
}

/** Multi-turn AI travel chat. */
export async function generateChatReply(payload: ChatRequest): Promise<ChatResponse> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    safetySettings,
    generationConfig: { temperature: 0.8, maxOutputTokens: 400 },
    systemInstruction: `You are an expert AI travel companion called Travel Nomad.
Help users plan trips, discover places, and give contextual travel advice.
Be friendly, concise, and specific. Mention the location if coordinates are provided.
Keep replies under 120 words. Never output JSON in chat responses.`,
  });

  const locationContext = payload.location
    ? `\n[User's selected map location: ${payload.location.lat.toFixed(4)}, ${payload.location.lng.toFixed(4)}]`
    : "";

  const history = (payload.history ?? []).map((h) => ({
    role: h.role as "user" | "model",
    parts: h.parts,
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(payload.message + locationContext);
  return { reply: result.response.text().trim() };
}
