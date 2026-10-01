import { useId } from "react";
import { motion } from "motion/react";
import type { CircularProgressProps } from "./types";

const VARIANT_CONFIG = {
  test: {
    trackColor: "#FEE2E2",
    gradientFrom: "#F43F5E",
    gradientTo: "#EF4444",
    valueClass: "text-red-500",
    centerVariant: "fraction-animated" as const,
    animationDelay: 0.5,
    label: "câu đúng",
  },
  practice: {
    trackColor: "#E1F5FE",
    gradientFrom: "#10B981",
    gradientTo: "#059669",
    valueClass: "text-emerald-500",
    centerVariant: "fraction-animated" as const,
    animationDelay: 0.5,
    label: "câu đúng",
  },
  "toeic-test": {
    trackColor: "#FEE2E2",
    gradientFrom: "#4F46E5",
    gradientTo: "#7C3AED",
    valueClass: "text-indigo-900",
    centerVariant: "stacked" as const,
    animationDelay: 0.2,
    label: "câu",
  },
  "toeic-practice": {
    trackColor: "#E1F5FE",
    gradientFrom: "#10B981",
    gradientTo: "#059669",
    valueClass: "text-emerald-500",
    centerVariant: "fraction-large" as const,
    animationDelay: 0.5,
    label: "câu đúng",
  },
};

export function CircularProgress({ value, max, variant = "test" }: CircularProgressProps) {
  const gradientId = useId();
  const config = VARIANT_CONFIG[variant];
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? (value / max) * 100 : 0;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative w-52 h-52">
      <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="100" cy="100" r={radius} fill="none" stroke={config.trackColor} strokeWidth="14" />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: "easeOut", delay: config.animationDelay }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={config.gradientFrom} />
            <stop offset="100%" stopColor={config.gradientTo} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {config.centerVariant === "fraction-animated" && (
          <>
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5, type: "spring" }}
              className={`text-4xl font-bold ${config.valueClass}`}
            >
              {value}/{max}
            </motion.span>
            <span className="text-xs mt-1 text-slate-400">
              {config.label}
            </span>
          </>
        )}
        {config.centerVariant === "stacked" && (
          <>
            <span className={`text-5xl font-black tracking-tight ${config.valueClass}`}>
              {value}
            </span>
            <span className="text-sm font-bold text-indigo-500">
              / {max} {config.label}
            </span>
          </>
        )}
        {config.centerVariant === "fraction-large" && (
          <>
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5, type: "spring" }}
              className={`text-5xl font-black tracking-tight ${config.valueClass}`}
            >
              {value}/{max}
            </motion.span>
            <span className="text-xs mt-1 font-bold text-slate-400">
              {config.label}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
