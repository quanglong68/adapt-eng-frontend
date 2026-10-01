export interface VipTarot {
  target_word: string;
  english_sentence: string;
  options: string[];
  vietnamese_translation: string;
}

export interface VipStorySentence {
  english_sentence: string;
  has_blank: boolean;
  target_word: string | null;
  options: string[] | null;
  vietnamese_translation: string;
}

export interface VipStory {
  title: string;
  genre: string;
  sentences: VipStorySentence[];
}

export interface VipEntertainmentContent {
  tarot: VipTarot;
  stories: VipStory[];
}

export type VipEntertainmentStatus = "HAS_STORY" | "DONE_TODAY" | "EMPTY";
export type VipEntertainmentEmptyReason = "NOT_VIP" | "NO_PENDING_WORDS" | "WAITING_JOB";

export interface VipDailyEntertainment {
  id: number | null;
  contentJson: string | null;
  isCompleted: boolean;
  entertainmentDate: string | null;
  status?: VipEntertainmentStatus | null;
  emptyReason?: VipEntertainmentEmptyReason | null;
}

export interface VipEntertainmentStatusInfo {
  pendingCount: number;
  vip: boolean;
  hasIncompleteStory: boolean;
  nextRunAt: string;
}

export interface VipSavedWord {
  id: number;
  word: string;
  createdAt: string;
}

export interface VipSaveWordResponse {
  success: boolean;
  message: string;
  locked?: boolean;
  currentCount?: number;
  maxCount?: number;
}

export interface VipFomoCheck {
  locked: boolean;
  message: string;
}