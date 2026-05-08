"use client";

import type { PreferenceId } from "@/types";
import { motion } from "framer-motion";

const FILTERS: { id: PreferenceId; label: string; emoji: string }[] = [
  { id: "scenic",       label: "Scenic",           emoji: "🏔️" },
  { id: "budget",       label: "Budget-friendly",   emoji: "💰" },
  { id: "food",         label: "Food-focused",      emoji: "🍜" },
  { id: "nightlife",    label: "Nightlife",          emoji: "🌙" },
  { id: "quiet",        label: "Quiet places",      emoji: "🌿" },
  { id: "less-walking", label: "Less walking",      emoji: "🚗" },
];

interface PreferenceFiltersProps {
  selected: string[];
  onChange: (next: string[]) => void;
}

export default function PreferenceFilters({ selected, onChange }: PreferenceFiltersProps) {
  const toggle = (id: PreferenceId) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  return (
    <div role="group" aria-label="Travel preference filters" className="flex flex-wrap gap-2">
      {FILTERS.map(({ id, label, emoji }) => {
        const active = selected.includes(id);
        return (
          <motion.button
            key={id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggle(id)}
            aria-pressed={active}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
              border transition-all duration-200 cursor-pointer select-none shadow-sm
              ${active
                ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/25"
                : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50"
              }
            `}
          >
            <span aria-hidden="true">{emoji}</span>
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}
