import { Level } from './common.type';

// --- ĐỀ THI WRITING LẤY VỀ ---
export interface WritingQuestion {
  questionId: number;
  imageUrl: string;
  givenWords: string;
  // Câu bốc từ SM-2 sẽ có giá trị (bắt buộc dùng đúng ngữ pháp đó),
  // câu bốc random từ kho mới sẽ null để AI chấm tự do.
  requiredGrammar: string | null;
}

export interface WritingTestResponse {
  recordId: number;
  status: string;
  testType: string;
  questions: WritingQuestion[];
  savedAnswers: Record<number, string> | null;
}

// --- NỘP BÀI WRITING LÊN ---
export interface WritingUserAnswer {
  questionId: number;
  selectedAnswer: string;
}

export interface SubmitWritingTestRequest {
  testedLevel: Level;
  answers: WritingUserAnswer[];
}

// --- KẾT QUẢ CHẤM ĐIỂM TỪ AI TRẢ VỀ ---
export interface WritingQuestionReview {
  questionId: number;
  userSelectedAnswer: string;
  correctAnswer: string; // Chứa chuỗi "Điểm: x/3"
  explanation: string;
  knowledgeName: string;
  correct: boolean;
}

export interface WritingTestSubmissionResponse {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  passedThreshold: boolean;
  testedLevel: Level;
  recommendedLevel: Level;
  reviewList: WritingQuestionReview[];
}

// --- CẤU TRÚC CHO LUYỆN TẬP WRITING HÀNG NGÀY (mirror toeic.type.ts) ---
export interface SubmitWritingPracticeRequest {
  answers: WritingUserAnswer[];
}

export interface WritingPracticeSubmissionResponse {
  totalQuestions: number;
  totalScore: number;      // TỔNG điểm, thang 0-3 mỗi câu (không phải số câu đúng)
  maxScore: number;        // = totalQuestions * 3
  reviewList: WritingQuestionReview[];
  // LƯU Ý: Backend khai báo `boolean isValidEffort` nhưng Jackson trả về key là
  // "validEffort" (Lombok sinh getter isValidEffort() -> Jackson bỏ tiền tố "is").
  // Đã đối chiếu với DailyReviewResultResponseDto của Reading đang chạy thật.
  validEffort: boolean;    // >= 10% mới được tính XP và streak
  earnedXp: number;
}

export interface WritingPracticeSessionResponse {
  recordId: number;
  status: string;
  questions: WritingQuestion[];
  savedAnswers: Record<number, string>; // Map chứa đáp án đang soạn dở
}

export interface SaveWritingPracticeDraftRequest {
  answers: Record<number, string>;
}

export interface DailyWritingPracticeHistoryResponse {
  recordId: number;
  status: string;
  testDate: string;
  score: number | null;  // Backend khai báo Integer nên có thể null khi bài chưa chấm xong
  totalQuestions: number;
  reviewJson: string;     // Chuỗi JSON chứa WritingQuestionReview[]
  questionsJson: string;  // Chuỗi JSON chứa WritingQuestion[]
}