"use client";

import { useState, useEffect } from 'react';
import type { Place } from '@/types';

export interface SavedPlace extends Place {
  id: string;
  savedAt: string;
}

export function useSavedPlaces() {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('travel_nomad_saved_places');
    if (data) {
      try {
        setSavedPlaces(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse saved places", e);
      }
    }
  }, []);

  const savePlace = (place: Place) => {
    // Check if already saved
    if (savedPlaces.some(p => p.name === place.name)) return;
    
    const newItem: SavedPlace = {
      ...place,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      savedAt: new Date().toISOString(),
    };
    const next = [newItem, ...savedPlaces];
    setSavedPlaces(next);
    localStorage.setItem('travel_nomad_saved_places', JSON.stringify(next));
  };

  const removePlace = (id: string) => {
    const next = savedPlaces.filter((s) => s.id !== id);
    setSavedPlaces(next);
    localStorage.setItem('travel_nomad_saved_places', JSON.stringify(next));
  };

  const isPlaceSaved = (name: string) => {
    return savedPlaces.some((s) => s.name === name);
  };

  return { savedPlaces, savePlace, removePlace, isPlaceSaved };
}
