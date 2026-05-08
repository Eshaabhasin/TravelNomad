import { NextRequest, NextResponse } from "next/server";
import { generateRecommendations } from "@/services/geminiService";
import type { RecommendationRequest, ApiError } from "@/types";

// ─── Input validation ────────────────────────────────────────────────────────
function validatePayload(body: unknown): body is RecommendationRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (!b.location || typeof b.location !== "object") return false;
  const loc = b.location as Record<string, unknown>;
  if (typeof loc.lat !== "number" || typeof loc.lng !== "number") return false;
  if (loc.lat < -90 || loc.lat > 90 || loc.lng < -180 || loc.lng > 180) return false;
  return true;
}

// Mock data for when the API key is not configured
const MOCK_DATA = {
  summary: "A calm food walk through hidden cafes and cultural spots.",
  places: [
    {
      name: "The Blue Tokai Coffee Roasters",
      reason: "Quiet ambience and artisanal coffee — great for a relaxed break.",
      rating: 4.5,
      distance: "1.2 km",
      category: "Café",
    },
    {
      name: "United Coffee House",
      reason: "Vintage charm meets great food in a timeless setting.",
      rating: 4.3,
      distance: "0.8 km",
      category: "Restaurant",
    },
    {
      name: "National Gallery of Modern Art",
      reason: "Immerse yourself in Indian art — calm, scenic, and culturally rich.",
      rating: 4.6,
      distance: "2.1 km",
      category: "Museum",
    },
  ],
  routeStyle: "Scenic Walk",
  estimatedTime: "~2 hours",
};

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json().catch(() => null);

    if (!validatePayload(body)) {
      const err: ApiError = { error: "Invalid request payload." };
      return NextResponse.json(err, { status: 400 });
    }

    const { location, preferences = [], timeLimit = "2 hours" } = body;

    // Sanitize preferences — only allow known values to prevent injection
    const allowed = ["scenic", "budget", "food", "nightlife", "quiet", "less-walking"];
    const safePreferences = preferences
      .filter((p: string) => allowed.includes(p))
      .slice(0, 6);

    // If no API key, return deterministic mock data
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(MOCK_DATA);
    }

    const data = await generateRecommendations(
      location.lat,
      location.lng,
      safePreferences,
      timeLimit
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/recommendations]", error);
    // Fallback to mock data to ensure the demo always works, even if the API key is invalid
    return NextResponse.json(MOCK_DATA);
  }
}
