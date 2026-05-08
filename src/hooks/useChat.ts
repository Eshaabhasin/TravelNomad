"use client";

import { useState, useCallback } from "react";
import type { ChatMessage, LatLng } from "@/types";
import { sendChatMessage } from "@/services/apiService";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface UseChatOptions {
  location?: LatLng | null;
  preferences?: string[];
}

export function useChat({ location, preferences }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hi! I'm your AI travel companion. Click anywhere on the map to get smart recommendations, or ask me anything about your destination.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      // Build history for multi-turn context (last 10 messages)
      const history = messages
        .slice(-10)
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          parts: [{ text: m.content }],
        }));

      try {
        const response = await sendChatMessage({
          message: text,
          location: location || undefined,
          preferences,
          history,
        });

        const aiMsg: ChatMessage = {
          id: generateId(),
          role: "ai",
          content: response.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Something went wrong.";
        setError(errMsg);
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "ai",
            content: "Sorry, I couldn't process that. Please try again.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, location, preferences]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "ai",
        content:
          "Chat cleared. Ask me anything about your next destination!",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
