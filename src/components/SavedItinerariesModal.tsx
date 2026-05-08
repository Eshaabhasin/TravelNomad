"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Trash2, Route, Star, Bookmark } from "lucide-react";
import type { SavedItinerary } from "@/hooks/useSavedItineraries";
import type { SavedPlace } from "@/hooks/useSavedPlaces";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  saved: SavedItinerary[];
  onRemove: (id: string) => void;
  onSelect: (itinerary: SavedItinerary) => void;
  savedPlaces: SavedPlace[];
  onRemovePlace: (id: string) => void;
}

export default function SavedItinerariesModal({ 
  isOpen, onClose, saved, onRemove, onSelect, savedPlaces, onRemovePlace 
}: Props) {
  const [activeTab, setActiveTab] = useState<"plans" | "places">("plans");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Saved Items</h2>
                <p className="text-sm text-slate-500 font-medium mt-0.5">Your personal travel library</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-6 pt-4 gap-4 border-b border-slate-100">
              <button
                onClick={() => setActiveTab("plans")}
                className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
                  activeTab === "plans" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Itineraries ({saved.length})
              </button>
              <button
                onClick={() => setActiveTab("places")}
                className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
                  activeTab === "places" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Places ({savedPlaces.length})
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {activeTab === "plans" && (
                saved.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Route className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-slate-900 font-bold mb-1">No saved plans yet</h3>
                    <p className="text-sm text-slate-500">Generate an itinerary and click 'Save Plan' to keep it here.</p>
                  </div>
                ) : (
                  saved.map((item) => (
                    <div
                      key={item.id}
                      className="group border border-slate-200 rounded-2xl p-4 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer bg-white"
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {item.recommendations.summary}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                          {item.recommendations.places.length} places
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}

              {activeTab === "places" && (
                savedPlaces.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bookmark className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-slate-900 font-bold mb-1">No saved places yet</h3>
                    <p className="text-sm text-slate-500">Click the bookmark icon on any specific place to save it here.</p>
                  </div>
                ) : (
                  savedPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="group border border-slate-200 rounded-2xl p-4 hover:border-emerald-400 hover:shadow-lg transition-all bg-white relative"
                    >
                      <button
                        onClick={() => onRemovePlace(place.id)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Delete place"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <h3 className="font-bold text-slate-900 pr-8 mb-2">
                        {place.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {place.rating != null && (
                          <span className="flex items-center gap-0.5 text-amber-500 text-xs font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
                            <Star className="w-3 h-3 fill-current" />
                            {place.rating.toFixed(1)}
                          </span>
                        )}
                        {place.category && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border text-slate-600 bg-slate-50 border-slate-200">
                            {place.category}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 text-xs leading-relaxed font-medium">{place.reason}</p>
                    </div>
                  ))
                )
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
