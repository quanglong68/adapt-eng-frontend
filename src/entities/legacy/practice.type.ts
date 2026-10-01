
export interface PracticeUserAnswer {
  questionId: number;
  selectedAnswer: string;
}

export interface DailyReviewSubmissionRequest {
  answers: PracticeUserAnswer[];
}

export interface PracticeQuestionReview {
  questionId: number;
  userSelectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
  explanation: string;
  knowledgeName: string;
}

export interface DailyReviewResultResponse {
  totalQuestions: number;
  correctAnswers: number;
  reviewList: PracticeQuestionReview[];
}