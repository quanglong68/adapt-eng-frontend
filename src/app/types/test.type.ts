import { Level, QuestionType } from './common.type';


export interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
}

export interface SubmitTestRequest {
  testedLevel: Level;
  answers: UserAnswer[];
}

export interface QuestionReview {
  questionId: number;
  userSelectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
  explanation: string;
  knowledgeName: string;
}

export interface TestSubmissionResponse {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  passedThreshold: boolean;
  testedLevel: Level;
  recommendedLevel: Level;
  systemMessage: string;
  reviewList: QuestionReview[];
}