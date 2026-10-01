export interface DeepDiveRecommendation {
  knowledgeItemId: string;
  targetWord: string | null;
  knowledgeName: string;
  easeFactor: number;
  difficultyLevel: string; // "Rất cao" | "Cao"
  // 🚀 ĐÃ THÊM: Đón dữ liệu trạng thái từ backend để giữ nút khi F5
  activeSessionId?: string;
  activeSessionStatus?: 'IDLE' | 'GENERATING' | 'READY';
}

export interface DeepDiveInitRequest {
  knowledgeItemId: string;
  targetWord: string | null;
}

export interface DeepDiveInitResponse {
  sessionId: string;
  status: string;
  message: string;
}

export interface DeepDiveSubmitRequest {
  answers: Record<number, string>; 
}

export interface DeepDiveSubmitResponse {
  score: number;
  total: number;
  scorePercent: number;
  message: string;
  reviewList?: any[];
}