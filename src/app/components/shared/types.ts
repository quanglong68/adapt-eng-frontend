import type { ReactNode } from "react";

export type ExecutionTheme = "indigo" | "green" | "emerald";

export interface ExecutionThemeConfig {
  primary: string;
  primaryLight: string;
  gradientFrom: string;
  gradientTo: string;
  selectedBg: string;
  blankBg: string;
  blankBorder: string;
  blankColor: string;
  hoverShadow: string;
  selectedShadow: string;
  badgeBg: string;
  badgeColor: string;
}

export const EXECUTION_THEMES: Record<ExecutionTheme, ExecutionThemeConfig> = {
  indigo: {
    primary: "#4F46E5",
    primaryLight: "#EEF2FF",
    gradientFrom: "#4F46E5",
    gradientTo: "#7C3AED",
    selectedBg: "#EEF2FF",
    blankBg: "#EEF2FF",
    blankBorder: "#4F46E5",
    blankColor: "#4F46E5",
    hoverShadow: "0 4px 20px rgba(79,70,229,0.12)",
    selectedShadow: "0 4px 20px rgba(79,70,229,0.15)",
    badgeBg: "#EEF2FF",
    badgeColor: "#4F46E5",
  },
  green: {
    primary: "#10B981",
    primaryLight: "#ECFDF5",
    gradientFrom: "#10B981",
    gradientTo: "#059669",
    selectedBg: "#ECFDF5",
    blankBg: "#ECFDF5",
    blankBorder: "#10B981",
    blankColor: "#10B981",
    hoverShadow: "0 4px 20px rgba(16,185,129,0.12)",
    selectedShadow: "0 4px 20px rgba(16,185,129,0.15)",
    badgeBg: "#EEF2FF",
    badgeColor: "#4F46E5",
  },
  emerald: {
    primary: "#10B981",
    primaryLight: "#ECFDF5",
    gradientFrom: "#10B981",
    gradientTo: "#059669",
    selectedBg: "#ECFDF5",
    blankBg: "#ECFDF5",
    blankBorder: "#10B981",
    blankColor: "#10B981",
    hoverShadow: "0 4px 20px rgba(16,185,129,0.12)",
    selectedShadow: "0 4px 20px rgba(16,185,129,0.15)",
    badgeBg: "#ECFDF5",
    badgeColor: "#059669",
  },
};

export type CircularProgressVariant = "test" | "practice" | "toeic-test" | "toeic-practice";

export interface CircularProgressProps {
  value: number;
  max: number;
  variant?: CircularProgressVariant;
}

export interface ExitModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  variant?: "standard" | "compact";
}

export interface SubmitConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmColor?: string;
  confirmShadow?: string;
}

export interface ProgressBarProps {
  progress: number;
  variant?: "standard" | "toeic";
  gradientFrom?: string;
  gradientTo?: string;
  barColor?: string;
  showPercentage?: boolean;
  countLabel?: string;
  badgeBg?: string;
  badgeColor?: string;
}

export interface GeneralOptionButtonProps {
  optionText: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  theme: ExecutionThemeConfig;
}

export interface ToeicOptionButtonProps {
  optionText: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  theme: "indigo" | "emerald";
}

export interface QuestionReviewItem {
  questionId: number;
  userSelectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
  explanation: string;
  knowledgeName: string;
}

export interface MistakeCardProps {
  item: QuestionReviewItem;
  index: number;
  originalContent?: string;
  originalContentPlacement?: "after-header" | "in-body";
  options?: string[];
  correctLabel?: string;
  wrongLabel?: string;
  correctBadgeText?: string;
  wrongBadgeText?: string;
  explanationVariant?: "indigo" | "green";
  showKnowledgeHeading?: boolean;
}
