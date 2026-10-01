import { motion, AnimatePresence } from "motion/react";
import type { GeneralOptionButtonProps, ToeicOptionButtonProps } from "./types";

const TOEIC_THEME_CLASSES = {
  indigo: {
    selected: "border-indigo-600 bg-indigo-50",
    unselected: "border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/50",
    letterSelected: "bg-indigo-600 text-white",
    letterUnselected: "bg-slate-100 text-slate-500",
    textSelected: "text-indigo-900 font-semibold",
    textUnselected: "text-slate-600",
  },
  emerald: {
    selected: "border-emerald-600 bg-emerald-50",
    unselected: "border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/50",
    letterSelected: "bg-emerald-600 text-white",
    letterUnselected: "bg-slate-100 text-slate-500",
    textSelected: "text-emerald-900 font-semibold",
    textUnselected: "text-slate-600",
  },
};

export function GeneralOptionButton({
  optionText,
  index,
  isSelected,
  onSelect,
  theme,
}: GeneralOptionButtonProps) {
  const letter = String.fromCharCode(65 + index);

  return (
    <motion.button
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.01, boxShadow: theme.hoverShadow }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all"
      style={{
        background: isSelected ? theme.selectedBg : "#fff",
        border: `2px solid ${isSelected ? theme.primary : "#E5E7EB"}`,
        boxShadow: isSelected ? theme.selectedShadow : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <motion.div
        animate={{
          background: isSelected ? theme.primary : "#F1F5F9",
          scale: isSelected ? 1.08 : 1,
        }}
        transition={{ type: "spring", damping: 14 }}
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
        style={{ color: isSelected ? "#fff" : "#64748B" }}
      >
        {letter}
      </motion.div>
      <span className="text-base font-medium flex-1" style={{ color: "#1E293B" }}>
        {optionText}
      </span>
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: theme.primary }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7l3 3 5-5"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function ToeicOptionButton({
  optionText,
  index,
  isSelected,
  onSelect,
  theme,
}: ToeicOptionButtonProps) {
  const labels = ["A", "B", "C", "D"];
  const classes = TOEIC_THEME_CLASSES[theme];

  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
        isSelected ? classes.selected : classes.unselected
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          isSelected ? classes.letterSelected : classes.letterUnselected
        }`}
      >
        {labels[index]}
      </div>
      <span className={`flex-1 text-[14px] ${isSelected ? classes.textSelected : classes.textUnselected}`}>
        {optionText}
      </span>
    </button>
  );
}
