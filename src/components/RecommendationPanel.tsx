"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Clock, Route, ChevronRight, Bookmark } from "lucide-react";
import type { Recommendations, Place } from "@/types";

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="bg-transparent p-5 space-y-5" aria-busy="true">
      <div className="h-6 bg-slate-200/50 rounded-lg w-3/5 animate-pulse" />
      <div className="h-4 bg-slate-200/50 rounded w-2/5 animate-pulse" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-slate-200/50 bg-white/50 rounded-2xl p-4 space-y-3 animate-pulse">
          <div className="h-4 bg-slate-200/50 rounded w-2/3" />
          <div className="h-3 bg-slate-200/50 rounded w-full" />
          <div className="h-3 bg-slate-200/50 rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-transparent p-10 text-center h-full flex flex-col items-center justify-center"
    >
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-5 shadow-inner">
        <MapPin className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-slate-900 font-bold text-base mb-2">No location selected</h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">
        Tap anywhere on the map to get AI-powered travel recommendations for that area.
      </p>
    </motion.div>
  );
}

/* ── Place card ──────────────────────────────────────────────────────────── */
const CATEGORY_STYLES: Record<string, string> = {
  "Café":       "text-amber-700  bg-amber-50  border-amber-200",
  "Restaurant": "text-orange-700 bg-orange-50 border-orange-200",
  "Museum":     "text-purple-700 bg-purple-50 border-purple-200",
  "Park":       "text-emerald-700  bg-emerald-50  border-emerald-200",
  "default":    "text-sky-700   bg-sky-50   border-sky-200",
};

function PlaceCard({ 
  place, 
  index, 
  onSavePlace, 
  isPlaceSaved 
}: { 
  place: Place; 
  index: number;
  onSavePlace?: (place: Place) => void;
  isPlaceSaved?: (name: string) => boolean;
}) {
  const catStyle = CATEGORY_STYLES[place.category ?? ""] ?? CATEGORY_STYLES.default;
  const isSaved = isPlaceSaved?.(place.name) ?? false;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="group border border-slate-200/60 rounded-2xl p-4 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-md relative"
      aria-label={place.name}
    >
      {onSavePlace && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isSaved) onSavePlace(place);
          }}
          disabled={isSaved}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            isSaved 
              ? "text-emerald-500 bg-emerald-50" 
              : "text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 opacity-0 group-hover:opacity-100"
          }`}
          aria-label="Save place"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      )}

      <div className="flex items-start justify-between gap-3 mb-2.5 pr-8">
        <h3 className="text-slate-900 font-bold text-sm leading-snug group-hover:text-emerald-600 transition-colors">
          {place.name}
        </h3>
      </div>
      
      <div className="flex items-center gap-2 mb-2.5">
        {place.rating != null && (
          <span className="flex items-center gap-0.5 text-amber-500 text-xs font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
            <Star className="w-3 h-3 fill-current" />
            {place.rating.toFixed(1)}
          </span>
        )}
        {place.category && (
          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${catStyle}`}>
            {place.category}
          </span>
        )}
      </div>

      <p className="text-slate-600 text-xs leading-relaxed font-medium">{place.reason}</p>

      {place.distance && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 bg-slate-50 inline-flex px-2 py-1 rounded-md">
          <MapPin className="w-3 h-3 text-slate-400" />
          {place.distance} away
        </div>
      )}
    </motion.article>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function RecommendationPanel({
  recommendations,
  isLoading,
  error,
  onSave,
  isSaved,
  onSavePlace,
  isPlaceSaved,
}: {
  recommendations: Recommendations | null;
  isLoading: boolean;
  error?: string | null;
  onSave?: () => void;
  isSaved?: boolean;
  onSavePlace?: (place: Place) => void;
  isPlaceSaved?: (name: string) => boolean;
}) {
  if (isLoading) return <Skeleton />;

  if (error) return (
    <div role="alert" className="bg-white/80 rounded-2xl border border-red-200 shadow-lg p-6 text-center m-4">
      <p className="text-red-600 font-bold text-sm mb-1.5">Could not load recommendations</p>
      <p className="text-slate-500 text-xs">{error}</p>
    </div>
  );

  if (!recommendations) return <EmptyState />;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key="recs"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 16 }}
        className="flex flex-col h-full bg-transparent"
        aria-label="AI travel recommendations"
      >
        {/* Header */}
        <div className="p-6 pb-5 border-b border-slate-200/50 flex-shrink-0 bg-white/40">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <Route className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <h2 className="text-slate-900 text-sm font-bold leading-snug">
                  {recommendations.summary}
                </h2>
                {onSave && (
                  <button
                    onClick={onSave}
                    disabled={isSaved}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors ${
                      isSaved
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 active:scale-95"
                    }`}
                  >
                    {isSaved ? "Saved" : "Save Plan"}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg px-2.5 py-1 font-bold shadow-sm">
                  <Route className="w-3 h-3" />
                  {recommendations.routeStyle}
                </span>
                {recommendations.estimatedTime && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-indigo-700 bg-indigo-100 border border-indigo-200 rounded-lg px-2.5 py-1 font-bold shadow-sm">
                    <Clock className="w-3 h-3" />
                    {recommendations.estimatedTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Place list */}
        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-white/20">
          {recommendations.places.map((place, i) => (
            <PlaceCard 
              key={`${place.name}-${i}`} 
              place={place} 
              index={i} 
              onSavePlace={onSavePlace}
              isPlaceSaved={isPlaceSaved}
            />
          ))}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
