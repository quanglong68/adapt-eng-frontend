import apiClient from './api';
import { 
  DeepDiveInitRequest, 
  DeepDiveInitResponse, 
  DeepDiveRecommendation, 
  DeepDiveSubmitRequest, 
  DeepDiveSubmitResponse 
} from "../types/deepDive.type";
// 🚀 ĐÃ SỬA: Import thêm ToeicPassageResponse
import { ToeicPassageResponse } from '../types/toeic.type';

export const deepDiveService = {
  // 1. Lấy Top 10 điểm yếu
  getRecommendations: async (): Promise<DeepDiveRecommendation[]> => {
    const response = await apiClient.get<DeepDiveRecommendation[]>('/vip/deep-dive/recommendations');
    return response.data;
  },

  // 2. Bấm nút "Ôn tập" -> Đẻ Session
  initSession: async (data: DeepDiveInitRequest): Promise<DeepDiveInitResponse> => {
    const response = await apiClient.post<DeepDiveInitResponse>('/vip/deep-dive/init', data);
    return response.data;
  },

  // 3. Lấy câu hỏi khi Session đã READY
  // 🚀 ĐÃ SỬA: Đổi kiểu trả về từ QuestionResponse[] thành ToeicPassageResponse[] cho khớp Backend mới
  getSessionQuestions: async (sessionId: string): Promise<ToeicPassageResponse[]> => {
    const response = await apiClient.get<ToeicPassageResponse[]>(`/vip/deep-dive/${sessionId}/questions`);
    return response.data;
  },

  // 4. Nộp bài
  submitSession: async (sessionId: string, data: DeepDiveSubmitRequest): Promise<DeepDiveSubmitResponse> => {
    const response = await apiClient.post<DeepDiveSubmitResponse>(`/vip/deep-dive/${sessionId}/submit`, data);
    return response.data;
  }
};