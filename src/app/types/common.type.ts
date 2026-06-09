
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type QuestionType = 'MULTIPLE_CHOICE' | 'FILL_IN_THE_BLANK';

export interface QuestionResponse {
  questionId: number;
  content: string;
  options: string[];
  questionType: QuestionType;
}
