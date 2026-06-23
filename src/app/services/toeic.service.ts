// file: src/services/toeic.service.ts
import apiClient from './api';
import { Level } from '../types/common.type';
import { 
    ToeicPassageResponse, 
    SubmitToeicTestRequest, 
    ToeicTestSubmissionResponse,
    SubmitToeicPracticeRequest,
    ToeicPracticeSubmissionResponse
} from '../types/toeic.type';

export const toeicService = {
    // 1. Luồng Bài Test Tháng (Monthly Test)
    generateTest: async (level: Level): Promise<ToeicPassageResponse[]> => {
        const response = await apiClient.get<ToeicPassageResponse[]>(`/toeic/test/generate/${level}`);
        return response.data;
    },

    submitTest: async (submissionData: SubmitToeicTestRequest): Promise<ToeicTestSubmissionResponse> => {
        const response = await apiClient.post<ToeicTestSubmissionResponse>('/toeic/test/submit', submissionData);
        return response.data;
    },

    // 2. Luồng Ôn tập Hàng ngày (Daily Practice)
    getDailyPractice: async (): Promise<ToeicPassageResponse[]> => {
        const response = await apiClient.get<ToeicPassageResponse[]>('/toeic/practice/daily');
        return response.data;
    },

    submitDailyPractice: async (submissionData: SubmitToeicPracticeRequest): Promise<ToeicPracticeSubmissionResponse> => {
        const response = await apiClient.post<ToeicPracticeSubmissionResponse>('/toeic/practice/submit', submissionData);
        return response.data;
    }
};