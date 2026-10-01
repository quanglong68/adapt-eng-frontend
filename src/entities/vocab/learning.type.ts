export interface SaveWordRequest {
  word: string;
}

export interface SaveWordResponse {
  id: number;
  targetWord: string;
  easeFactor: number;
  intervalDays: number;
  nextReviewDate: string;
}
