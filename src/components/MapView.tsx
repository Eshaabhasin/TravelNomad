"use client";

import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import type { SelectedLocation } from "@/types";

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID ?? "DEMO_MAP_ID";
const DEFAULT_CENTER = { lat: 28.6304, lng: 77.2177 };

interface MapViewProps {
  onLocationSelect: (location: SelectedLocation) => void;
  selectedLocation: SelectedLocation | null;
}

export default function MapView({ onLocationSelect, selectedLocation }: MapViewProps) {
  if (!MAPS_API_KEY || MAPS_API_KEY === "your_google_maps_api_key_here") {
    return (
      <div
        role="alert"
        className="w-full h-full flex flex-col items-center justify-center bg-[#f0f9f0] text-[#374151] gap-4 p-8 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div>
          <p className="text-[#0a0a0a] font-semibold mb-1">Google Maps API Key Missing</p>
          <p className="text-sm text-[#6b7280]">
            Add{" "}
            <code className="text-[#16a34a] bg-[#dcfce7] px-1.5 py-0.5 rounded text-xs font-mono">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>{" "}
            to your <code className="text-[#374151] bg-[#f3f4f6] px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code> file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={MAPS_API_KEY}>
      <Map
        defaultZoom={13}
        defaultCenter={DEFAULT_CENTER}
        mapId={MAP_ID}
        disableDefaultUI
        gestureHandling="greedy"
        onClick={(e) => {
          if (e.detail.latLng) {
            onLocationSelect({
              lat: e.detail.latLng.lat,
              lng: e.detail.latLng.lng,
              placeId: e.detail.placeId ?? undefined,
            });
          }
        }}
        aria-label="Interactive travel map — click to select a location"
      >
        {selectedLocation && (
          <AdvancedMarker
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            title="Selected location"
          >
            <Pin background="#16a34a" borderColor="#14532d" glyphColor="#fff" scale={1.2} />
          </AdvancedMarker>
        )}
      </Map>
    </APIProvider>
  );
}
