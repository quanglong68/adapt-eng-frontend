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

export interface VipDailyEntertainment {
  id: number | null;
  contentJson: string | null;
  isCompleted: boolean;
  entertainmentDate: string | null;
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