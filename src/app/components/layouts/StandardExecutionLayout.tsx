import React from "react";
import { motion } from "motion/react";
import { X, ChevronRight } from "lucide-react";
import { ExitModal, ProgressBar } from "../shared";
import type { ExecutionTheme, ExecutionThemeConfig } from "../shared";
import { EXECUTION_THEMES } from "../shared";

export interface StandardExecutionLayoutProps {
  theme: ExecutionTheme;
  questionLabel: string;
  currentNumber: number;
  totalQuestions: number;
  progress: number;
  showExit: boolean;
  onShowExit: () => void;
  onExitCancel: () => void;
  onExitConfirm: () => void;
  exitTitle: string;
  exitMessage: string;
  exitCancelLabel: string;
  exitConfirmLabel: string;
  questionContent: React.ReactNode;
  optionsContent: React.ReactNode;
  selectedAnswer: string | null;
  canGoBack: boolean;
  onBack: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  nextLabel: string;
}

export function StandardExecutionLayout({
  theme,
  questionLabel,
  currentNumber,
  totalQuestions,
  progress,
  showExit,
  onShowExit,
  onExitCancel,
  onExitConfirm,
  exitTitle,
  exitMessage,
  exitCancelLabel,
  exitConfirmLabel,
  questionContent,
  optionsContent,
  selectedAnswer,
  canGoBack,
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
}: StandardExecutionLayoutProps) {
  const themeConfig: ExecutionThemeConfig = EXECUTION_THEMES[theme];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F9FAFB", fontFamily: "'Poppins', sans-serif" }}>
      <ExitModal
        isOpen={showExit}
        title={exitTitle}
        message={exitMessage}
        cancelLabel={exitCancelLabel}
        confirmLabel={exitConfirmLabel}
        onCancel={onExitCancel}
        onConfirm={onExitConfirm}
        variant="standard"
      />

      <div
        className="bg-white border-b flex items-center gap-5 px-8 py-4"
        style={{ borderColor: "#E5E7EB", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: "#1E293B" }}>
                {questionLabel} {currentNumber}
              </span>
              <span className="text-sm" style={{ color: "#94A3B8" }}>
                / {totalQuestions}
              </span>
            </div>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ background: themeConfig.badgeBg, color: themeConfig.badgeColor }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <ProgressBar
            progress={progress}
            gradientFrom={themeConfig.gradientFrom}
            gradientTo={themeConfig.gradientTo}
            showPercentage={false}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.08, background: "#FEF2F2" }}
          whileTap={{ scale: 0.94 }}
          onClick={onShowExit}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
          style={{ background: "#F8FAFC", color: "#94A3B8" }}
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-2xl">
          {questionContent}
          <div className="space-y-3">{optionsContent}</div>
        </div>
      </div>

      <div
        className="bg-white border-t flex items-center px-8 py-5 relative"
        style={{ borderColor: "#E5E7EB", boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}
      >
        <div className="flex-1 flex justify-start">
          <motion.button
            disabled={!canGoBack}
            whileHover={{ scale: canGoBack ? 1.02 : 1 }}
            whileTap={{ scale: canGoBack ? 0.98 : 1 }}
            onClick={onBack}
            className="flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: !canGoBack ? "#F8FAFC" : "#F1F5F9",
              color: !canGoBack ? "#CBD5E1" : "#64748B",
              cursor: !canGoBack ? "not-allowed" : "pointer",
              border: "1px solid #E5E7EB",
            }}
          >
            Quay lại
          </motion.button>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: selectedAnswer ? "#10B981" : "#E5E7EB" }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: selectedAnswer ? "#10B981" : "#94A3B8" }}
          >
            {selectedAnswer ? `Đã chọn: ${selectedAnswer}` : "Chưa chọn đáp án"}
          </span>
        </div>

        <div className="flex-1 flex justify-end">
          <motion.button
            disabled={nextDisabled}
            whileHover={{ scale: !nextDisabled ? 1.02 : 1 }}
            whileTap={{ scale: !nextDisabled ? 0.98 : 1 }}
            onClick={onNext}
            className="flex items-center gap-2 px-10 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: !nextDisabled
                ? `linear-gradient(135deg, ${themeConfig.gradientFrom}, ${themeConfig.gradientTo})`
                : "#E5E7EB",
              color: !nextDisabled ? "#fff" : "#94A3B8",
              cursor: !nextDisabled ? "pointer" : "not-allowed",
              boxShadow: !nextDisabled ? `0 4px 16px ${themeConfig.primary}4D` : "none",
            }}
          >
            {nextLabel}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
