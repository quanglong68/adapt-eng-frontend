import type { ReactNode } from "react";
import { motion } from "motion/react";
import { X, ChevronRight, ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import { ExitModal, SubmitConfirmModal, ProgressBar } from "../shared";

export interface SplitScreenLayoutProps {
  theme: "indigo" | "emerald";
  title: ReactNode;
  progress: number;
  answeredCount: number;
  totalQuestions: number;
  onHeaderSubmit: () => void;
  isSubmitting: boolean;
  isPart5: boolean;
  partLabel: string;
  passageContent: ReactNode;
  questionsContent: ReactNode;
  currentBlockIndex: number;
  totalBlocks: number;
  onPrevBlock: () => void;
  onNextBlock: () => void;
  isLastBlock: boolean;
  onComplete: () => void;
  completeLabel: string;
  submittingLabel: string;
  prevBlockLabel: string;
  nextBlockLabel: string;
  showExit: boolean;
  onShowExit: () => void;
  onExitCancel: () => void;
  onExitConfirm: () => void;
  exitTitle: string;
  exitMessage: string;
  exitCancelLabel: string;
  exitConfirmLabel: string;
  showSubmitConfirm: boolean;
  onSubmitConfirmCancel: () => void;
  onSubmitConfirmConfirm: () => void;
  submitConfirmMessage: ReactNode;
  submitConfirmColor?: string;
  submitConfirmShadow?: string;
}

const THEME_CLASSES = {
  indigo: {
    accentText: "text-indigo-600",
    partBadge: "bg-indigo-50 text-indigo-700",
    barColor: "#6366F1",
    completeBtn: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200",
    submitConfirmColor: "#4F46E5",
    submitConfirmShadow: "shadow-indigo-200",
  },
  emerald: {
    accentText: "text-emerald-600",
    partBadge: "bg-emerald-50 text-emerald-700",
    barColor: "#10B981",
    completeBtn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    submitConfirmColor: "#059669",
    submitConfirmShadow: "shadow-emerald-200",
  },
};

export function SplitScreenLayout({
  theme,
  title,
  progress,
  answeredCount,
  totalQuestions,
  onHeaderSubmit,
  isSubmitting,
  isPart5,
  partLabel,
  passageContent,
  questionsContent,
  currentBlockIndex,
  totalBlocks,
  onPrevBlock,
  onNextBlock,
  isLastBlock,
  onComplete,
  completeLabel,
  submittingLabel,
  prevBlockLabel,
  nextBlockLabel,
  showExit,
  onShowExit,
  onExitCancel,
  onExitConfirm,
  exitTitle,
  exitMessage,
  exitCancelLabel,
  exitConfirmLabel,
  showSubmitConfirm,
  onSubmitConfirmCancel,
  onSubmitConfirmConfirm,
  submitConfirmMessage,
  submitConfirmColor,
  submitConfirmShadow,
}: SplitScreenLayoutProps) {
  const themeClasses = THEME_CLASSES[theme];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onShowExit}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
          <div className="font-bold text-slate-800 flex items-center gap-2">{title}</div>
        </div>

        <ProgressBar
          variant="toeic"
          progress={progress}
          barColor={themeClasses.barColor}
          countLabel={`${answeredCount} / ${totalQuestions}`}
        />

        <button
          onClick={onHeaderSubmit}
          disabled={isSubmitting}
          className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Nộp bài
        </button>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto w-full h-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
          {!isPart5 && (
            <div
              className="lg:w-1/2 h-1/3 lg:h-full border-b lg:border-b-0 lg:border-r border-slate-200 p-6 lg:p-10 overflow-y-auto"
              style={{ background: "#FDFDFD" }}
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 font-bold text-xs rounded-lg mb-6 ${themeClasses.partBadge}`}
              >
                {partLabel}
              </div>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {passageContent}
              </div>
            </div>
          )}

          <div
            className={`${isPart5 ? "w-full max-w-3xl mx-auto" : "lg:w-1/2"} h-2/3 lg:h-full p-6 lg:p-10 overflow-y-auto bg-white`}
          >
            {isPart5 && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 font-bold text-xs rounded-lg mb-8 ${themeClasses.partBadge}`}
              >
                PART 5 - INCOMPLETE SENTENCES
              </div>
            )}
            {questionsContent}
          </div>
        </div>
      </main>

      <footer className="h-20 bg-white border-t border-slate-200 px-6 lg:px-12 flex items-center justify-between shrink-0">
        <button
          onClick={onPrevBlock}
          disabled={currentBlockIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          {prevBlockLabel}
        </button>

        <div className="text-sm font-bold text-slate-400">
          Khối {currentBlockIndex + 1} / {totalBlocks}
        </div>

        {isLastBlock ? (
          <button
            onClick={onComplete}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 text-white rounded-xl font-bold shadow-lg transition-all ${themeClasses.completeBtn}`}
          >
            {isSubmitting ? submittingLabel : completeLabel}
            <CheckCircle2 className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onNextBlock}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-all"
          >
            {nextBlockLabel}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </footer>

      <ExitModal
        isOpen={showExit}
        title={exitTitle}
        message={exitMessage}
        cancelLabel={exitCancelLabel}
        confirmLabel={exitConfirmLabel}
        onCancel={onExitCancel}
        onConfirm={onExitConfirm}
        variant="compact"
      />

      <SubmitConfirmModal
        isOpen={showSubmitConfirm}
        title="Chưa làm hết bài!"
        message={submitConfirmMessage}
        cancelLabel="Làm tiếp"
        confirmLabel="Nộp bài luôn"
        onCancel={onSubmitConfirmCancel}
        onConfirm={onSubmitConfirmConfirm}
        confirmColor={submitConfirmColor ?? themeClasses.submitConfirmColor}
        confirmShadow={submitConfirmShadow ?? themeClasses.submitConfirmShadow}
      />
    </div>
  );
}
