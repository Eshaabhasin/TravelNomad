import { NextRequest, NextResponse } from "next/server";
import { generateChatReply } from "@/services/geminiService";
import type { ChatRequest, ApiError } from "@/types";

function sanitize(msg: unknown): string {
  if (typeof msg !== "string") return "";
  return msg.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 600).trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." } as ApiError, { status: 400 });
    }

    const raw = body as Record<string, unknown>;
    const message = sanitize(raw.message);
    if (!message) {
      return NextResponse.json({ error: "Message is required." } as ApiError, { status: 400 });
    }

    const payload: ChatRequest = {
      message,
      location: raw.location as ChatRequest["location"],
      preferences: raw.preferences as string[],
      history: raw.history as ChatRequest["history"],
    };

    // Graceful mock if key not configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply: `Thanks for your message! To enable full AI chat, add your GEMINI_API_KEY to .env.local.`,
      });
    }

    const response = await generateChatReply(payload);
    return NextResponse.json(response);

  } catch (error) {
    console.error("[/api/chat] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      reply: `API Error: ${message}`,
    });
  }
}
