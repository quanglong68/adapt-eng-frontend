// file: src/services/toeic.service.ts
import apiClient from './api';
import { Level } from '../types/common.type';
import { 
    ToeicPassageResponse, 
    SubmitToeicTestRequest, 
    ToeicTestSubmissionResponse,
    SubmitToeicPracticeRequest,
    ToeicPracticeSubmissionResponse,
    DailyPracticeHistoryResponse,
    SaveDraftRequest,
    DailyPracticeSessionResponse
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
    getDailyPractice: async (): Promise<DailyPracticeSessionResponse> => {
        const response = await apiClient.get<DailyPracticeSessionResponse>('/toeic/practice/daily');
        return response.data;
    },

    saveDraft: async (draftData: SaveDraftRequest): Promise<void> => {
        await apiClient.put('/toeic/practice/save-draft', draftData);
    },

    submitDailyPractice: async (submissionData: SubmitToeicPracticeRequest): Promise<ToeicPracticeSubmissionResponse> => {
        const response = await apiClient.post<ToeicPracticeSubmissionResponse>('/toeic/practice/submit', submissionData);
        return response.data;
    },

    getPracticeHistory: async (): Promise<DailyPracticeHistoryResponse[]> => {
        const response = await apiClient.get<DailyPracticeHistoryResponse[]>('/toeic/practice/history');
        return response.data;
    }
};