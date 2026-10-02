import { Level } from '../../shared/types/common.type';

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

// --- SESSION HỖN HỢP 3xP1 + P2 + P3 ---
export interface WritingPart23Question {
  questionId: number;
  toeicPart: "WRITING_PART_1" | "WRITING_PART_2" | "WRITING_PART_3";
  imageUrl?: string | null;
  givenWords?: string | null;
  knowledgeItemId?: string | null;
  requiredGrammar?: string | null;
  emailFrom?: string | null;
  emailTo?: string | null;
  emailDate?: string | null;
  emailSubject?: string | null;
  emailBody?: string | null;
  directions?: string | null;
  essayType?: string | null;
  essayQuestion?: string | null;
  // Ngữ pháp SM-2 bắt buộc dùng (P2 tối đa 2, P3 tối đa 5, P1/Test rỗng)
  requiredConstraints: string[];
}

export interface WritingPart23SessionResponse {
  recordId: number;
  status: string;
  testType: string;
  questions: WritingPart23Question[];
  savedAnswers?: Record<number, string> | null;
}

export interface WritingPart23ResultResponse {
  totalQuestions: number;
  totalScore: number;
  maxScore: number;
  part1Score: number;
  part2Score: number;
  part3Score: number;
  reviewList: WritingQuestionReview[];
  validEffort: boolean;
  earnedXp: number;
  // Chỉ luồng Test trả về (đánh giá xếp lớp), Daily là null
  recommendedLevel: Level | null;
  passedThreshold: boolean | null;
}