import { Level, QuestionType } from './common.type';


// --- CẤU TRÚC ĐỀ THI LẤY VỀ ---
export interface ToeicQuestionResponse {
  questionId: number;
  content: string;
  options: string[];
  questionType: QuestionType;
}

export interface ToeicPassageResponse {
  passageId: number | null;
  passageContent: string | null;
  toeicPart: string;
  questions: ToeicQuestionResponse[];
}

// --- CẤU TRÚC GỬI BÀI LÊN (SUBMIT) ---
export interface ToeicUserAnswer {
  questionId: number;
  selectedAnswer: string;
}

export interface SubmitToeicTestRequest {
  testedLevel: Level;
  answers: ToeicUserAnswer[];
}

// --- CẤU TRÚC KẾT QUẢ NHẬN VỀ TỪ TEST ---
export interface ToeicQuestionReview {
  questionId: number;
  userSelectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
  explanation: string;
  knowledgeName: string;
}

export interface ToeicTestSubmissionResponse {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  passedThreshold: boolean;
  testedLevel: Level;
  recommendedLevel: Level;
  systemMessage: string;
  reviewList: ToeicQuestionReview[];
}

// --- CẤU TRÚC CHO DAILY PRACTICE (Dùng sau) ---
export interface SubmitToeicPracticeRequest {
  answers: ToeicUserAnswer[];
}

export interface ToeicPracticeSubmissionResponse {
  totalQuestions: number;
  correctAnswers: number;
  reviewList: ToeicQuestionReview[];
}


export interface DailyPracticeSessionResponse {
  recordId: number;
  status: string;
  testContent: ToeicPassageResponse[];
  savedAnswers: Record<number, string>; // Map chứa đáp án đang chọn dở
}

export interface SaveDraftRequest {
  answers: Record<number, string>;
}

export interface DailyPracticeHistoryResponse {
  recordId: number;
  status: string;
  testDate: string;
  score: number;
  totalQuestions: number;
  reviewJson: string; // Chuỗi JSON chứa ToeicQuestionReview[]
  questionsJson: string;
}