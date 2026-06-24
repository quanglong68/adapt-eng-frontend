import { motion } from "motion/react";
import type { ProgressBarProps } from "./types";

export function ProgressBar({
  progress,
  variant = "standard",
  gradientFrom = "#4F46E5",
  gradientTo = "#7C3AED",
  barColor = "#6366F1",
  showPercentage = true,
  countLabel,
  badgeBg = "#EEF2FF",
  badgeColor = "#4F46E5",
}: ProgressBarProps) {
  if (variant === "toeic") {
    return (
      <div className="flex-1 max-w-xl mx-8 hidden md:flex items-center gap-4">
        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {countLabel && (
          <span className="text-sm font-semibold text-slate-500">{countLabel}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <div />
        {showPercentage && (
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ background: badgeBg, color: badgeColor }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
        />
      </div>
    </div>
  );
}
