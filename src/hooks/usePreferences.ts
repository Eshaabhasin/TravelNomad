"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "travelnomad_preferences";

export function usePreferences() {
  const [preferences, setPreferences] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPreferences(parsed);
        }
      }
    } catch {
      // silently ignore parse errors
    }
  }, []);

  const updatePreferences = (next: string[]) => {
    setPreferences(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // silently ignore storage errors (e.g. private mode)
    }
  };

  return { preferences, updatePreferences };
}
