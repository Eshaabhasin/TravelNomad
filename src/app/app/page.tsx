"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin, Compass, LogOut, User, ChevronDown, X, Info, Bookmark, Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AIChatPanel from "@/components/AIChatPanel";
import PreferenceFilters from "@/components/PreferenceFilters";
import RecommendationPanel from "@/components/RecommendationPanel";
import SavedItinerariesModal from "@/components/SavedItinerariesModal";
import { useRecommendations } from "@/hooks/useRecommendations";
import { usePreferences } from "@/hooks/usePreferences";
import { useSavedItineraries } from "@/hooks/useSavedItineraries";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import type { SelectedLocation } from "@/types";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Compass className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Initializing map…</p>
      </div>
    </div>
  ),
});

/* ── Top Nav Bar ──────────────────────────────────────────────────────────── */
function Navbar({ onLogout, onOpenSaved, savedCount }: { onLogout: () => void, onOpenSaved: () => void, savedCount: number }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
      style={{ flexShrink: 0 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500 rounded-xl shadow-md shadow-emerald-900/10">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-slate-900 text-base font-extrabold tracking-tight block leading-none">Travel Nomad</span>
          <p className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider leading-none mt-1.5">AI Companion</p>
        </div>
      </div>

      {/* Center hint */}
      <div className="hidden md:flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50/80 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-100/50 shadow-sm">
        <Compass className="w-4 h-4" />
        <span>Tap anywhere on the map for AI insights</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Saved Items Button */}
        <button
          onClick={onOpenSaved}
          className="flex items-center gap-2 pl-3 pr-3 py-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-slate-700 text-sm font-bold"
        >
          <Bookmark className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Saved Items</span>
          {savedCount > 0 && (
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-md font-extrabold">
              {savedCount}
            </span>
          )}
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            aria-label="User menu"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover shadow-sm" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600" />
              </div>
            )}
            <span className="text-slate-700 text-sm font-semibold max-w-[120px] truncate hidden sm:block">
              {user?.displayName || user?.email?.split("@")[0] || "Traveler"}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          <AnimatePresence>
            {open && (
              <>
                {/* Backdrop to close menu */}
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-slate-900 text-sm font-bold truncate">
                      {user?.displayName || "Traveler"}
                    </p>
                    <p className="text-slate-500 text-xs font-medium truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { setOpen(false); onLogout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

/* ── Main App ─────────────────────────────────────────────────────────────── */
export default function AppPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { preferences, updatePreferences } = usePreferences();
  const { recommendations, isLoading, error, fetchForLocation, setRecommendations } = useRecommendations();
  const { saved, save, remove, isSaved } = useSavedItineraries();
  const { savedPlaces, savePlace, removePlace, isPlaceSaved } = useSavedPlaces();

  /* Auth guard */
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const handleLocationSelect = async (loc: SelectedLocation) => {
    setSelectedLocation(loc);
    setShowHint(false);
    await fetchForLocation(loc, preferences);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleSave = () => {
    if (selectedLocation && recommendations) {
      save(selectedLocation, recommendations);
    }
  };

  const currentIsSaved = selectedLocation ? isSaved(selectedLocation) : false;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
      <Navbar onLogout={handleLogout} onOpenSaved={() => setIsModalOpen(true)} savedCount={saved.length + savedPlaces.length} />

      {/* Content area — map is the base layer, panels float on top */}
      <div className="relative flex-1 min-h-0">
        {/* Map fills entire content area */}
        <div className="absolute inset-0 z-0">
          <MapView onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />
        </div>

        {/* Hint pill */}
        <AnimatePresence>
          {showHint && !selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md shadow-2xl rounded-full px-5 py-2.5 text-sm font-medium text-white"
            >
              <Info className="w-4 h-4 text-emerald-400" />
              Tap anywhere on the map to explore
              <button onClick={() => setShowHint(false)} aria-label="Dismiss" className="text-slate-400 hover:text-white ml-2 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Floating panels ── */}
        <div className="absolute inset-0 z-10 pointer-events-none p-5 flex gap-5">

          {/* ── Left Panel ── */}
          <aside
            className="flex flex-col w-[360px] flex-shrink-0 gap-4 pointer-events-auto"
            style={{ height: '100%', maxHeight: '100%' }}
          >
            {/* Preferences card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-5 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-900 text-base font-bold">Travel Preferences</h2>
                {selectedLocation && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-bold shadow-sm">
                    <MapPin className="w-3 h-3" />
                    Location pinned
                  </span>
                )}
              </div>
              <PreferenceFilters selected={preferences} onChange={updatePreferences} />
              {selectedLocation && (
                <p className="text-[11px] text-slate-400 mt-3 font-mono bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100 inline-block">
                  {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                </p>
              )}
            </div>

            {/* Chat panel */}
            <div className="flex-1 min-h-0 flex flex-col bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <AIChatPanel location={selectedLocation} preferences={preferences} />
            </div>
          </aside>

          {/* ── Right Panel — Recommendations (anchored bottom-right) ── */}
          <aside className="ml-auto w-[400px] flex-shrink-0 pointer-events-auto flex flex-col justify-end" style={{ height: '100%', maxHeight: '100%' }}>
            <div className="max-h-full overflow-y-auto custom-scrollbar rounded-3xl pb-2">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                <RecommendationPanel
                  recommendations={recommendations}
                  isLoading={isLoading}
                  error={error}
                  onSave={handleSave}
                  isSaved={currentIsSaved}
                  onSavePlace={savePlace}
                  isPlaceSaved={isPlaceSaved}
                />
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* Saved Itineraries Modal */}
      <SavedItinerariesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        saved={saved}
        onRemove={remove}
        onSelect={(item) => {
          setSelectedLocation(item.location);
          setRecommendations(item.recommendations);
        }}
        savedPlaces={savedPlaces}
        onRemovePlace={removePlace}
      />
    </div>
  );
}
