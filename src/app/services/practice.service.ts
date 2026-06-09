import api from "./api";
import { DailyReviewSubmissionRequest, DailyReviewResultResponse } from "../types/practice.type";
import { QuestionResponse } from '../types/common.type'; 
export const practiceService = {
  getDailyReviewTest: async (): Promise<QuestionResponse[]> => {
    const response = await api.get<QuestionResponse[]>('/practice/daily');
    return response.data;
  },

  submitDailyReview: async (data: DailyReviewSubmissionRequest): Promise<DailyReviewResultResponse> => {
    const response = await api.post<DailyReviewResultResponse>('/practice/submit', data);
    return response.data;
  }
};