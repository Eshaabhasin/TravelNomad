"use client";

import { useState, useCallback } from "react";
import type { Recommendations, SelectedLocation } from "@/types";
import { fetchRecommendations } from "@/services/apiService";

interface UseRecommendationsReturn {
  recommendations: Recommendations | null;
  isLoading: boolean;
  error: string | null;
  fetchForLocation: (location: SelectedLocation, preferences: string[]) => Promise<void>;
  clear: () => void;
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendations | null>>;
}

export function useRecommendations(): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForLocation = useCallback(
    async (location: SelectedLocation, preferences: string[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRecommendations({
          location: { lat: location.lat, lng: location.lng },
          preferences,
          timeLimit: "2 hours",
        });
        setRecommendations(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load recommendations.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clear = useCallback(() => {
    setRecommendations(null);
    setError(null);
  }, []);

  return { recommendations, isLoading, error, fetchForLocation, clear, setRecommendations };
}
