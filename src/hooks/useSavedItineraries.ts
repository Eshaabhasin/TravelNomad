"use client";

import { useState, useEffect } from 'react';
import type { Recommendations, SelectedLocation } from '@/types';

export interface SavedItinerary {
  id: string;
  date: string;
  location: SelectedLocation;
  recommendations: Recommendations;
}

export function useSavedItineraries() {
  const [saved, setSaved] = useState<SavedItinerary[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('travel_nomad_saved');
    if (data) {
      try {
        setSaved(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse saved itineraries", e);
      }
    }
  }, []);

  const save = (location: SelectedLocation, recs: Recommendations) => {
    const newItem: SavedItinerary = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      location,
      recommendations: recs,
    };
    const next = [newItem, ...saved];
    setSaved(next);
    localStorage.setItem('travel_nomad_saved', JSON.stringify(next));
  };

  const remove = (id: string) => {
    const next = saved.filter((s) => s.id !== id);
    setSaved(next);
    localStorage.setItem('travel_nomad_saved', JSON.stringify(next));
  };

  const isSaved = (location: SelectedLocation) => {
    return saved.some((s) => s.location.lat === location.lat && s.location.lng === location.lng);
  };

  return { saved, save, remove, isSaved };
}
