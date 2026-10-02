import apiClient from '../../shared/api/api';
import { Level } from '../../shared/types/common.type';
import {
  WritingTestResponse,
  SubmitWritingTestRequest,
  WritingTestSubmissionResponse,
  SubmitWritingPracticeRequest,
  WritingPracticeSubmissionResponse,
  DailyWritingPracticeHistoryResponse,
  SaveWritingPracticeDraftRequest,
  WritingPracticeSessionResponse,
  WritingPart23SessionResponse,
  WritingPart23ResultResponse
} from './writing.type';

export const writingService = {
  // Bốc đề thi Placement Test cho Writing
  startPlacementTest: async (level: Level): Promise<WritingTestResponse> => {
    const response = await apiClient.post<WritingTestResponse>(`/writing/placement-test/start/${level}`);
    return response.data;
  },

  // Nộp bài và chờ AI chấm điểm
  submitPlacementTest: async (submissionData: SubmitWritingTestRequest): Promise<WritingTestSubmissionResponse> => {
    const response = await apiClient.post<WritingTestSubmissionResponse>('/writing/placement-test/submit', submissionData);
    return response.data;
  },

  // Cập nhật trình độ Writing sau khi đồng ý với kết quả của AI
  setWritingLevel: async (level: Level): Promise<void> => {
    await apiClient.put(`/users/writing-level/${level}`);
  },

  // ===== Luồng Luyện tập Hàng ngày (Daily Practice) =====

  // Lấy đề luyện tập hôm nay. Đã làm dở thì backend trả lại đề cũ kèm nháp đã lưu.
  getDailyPractice: async (): Promise<WritingPracticeSessionResponse> => {
    const response = await apiClient.get<WritingPracticeSessionResponse>('/writing/practice/daily');
    return response.data;
  },

  // Lưu nháp câu trả lời (auto-save)
  savePracticeDraft: async (draftData: SaveWritingPracticeDraftRequest): Promise<void> => {
    await apiClient.put('/writing/practice/save-draft', draftData);
  },

  // Nộp bài ôn tập -> AI chấm 0-3 điểm mỗi câu.
  // Ghi đè timeout lên 120s vì AI có retry (10s x 5 lần), dính mức global 60s sẽ bị cắt.
  submitDailyPractice: async (submissionData: SubmitWritingPracticeRequest): Promise<WritingPracticeSubmissionResponse> => {
    const response = await apiClient.post<WritingPracticeSubmissionResponse>('/writing/practice/submit', submissionData, { timeout: 120000 });
    return response.data;
  },

  // Lịch sử luyện tập Writing
  getPracticeHistory: async (): Promise<DailyWritingPracticeHistoryResponse[]> => {
    const response = await apiClient.get<DailyWritingPracticeHistoryResponse[]>('/writing/practice/history');
    return response.data;
  },

  // ===== Session hỗn hợp 3xP1 + P2 + P3 =====
  startCombinedTest: async (level: Level): Promise<WritingPart23SessionResponse> => {
    const response = await apiClient.post<WritingPart23SessionResponse>(`/writing/placement-test/combined/start/${level}`);
    return response.data;
  },

  submitCombinedTest: async (submissionData: SubmitWritingTestRequest): Promise<WritingPart23ResultResponse> => {
    const response = await apiClient.post<WritingPart23ResultResponse>('/writing/placement-test/combined/submit', submissionData, { timeout: 120000 });
    return response.data;
  },

  getCombinedDailyPractice: async (): Promise<WritingPart23SessionResponse> => {
    const response = await apiClient.get<WritingPart23SessionResponse>('/writing/combined/practice/daily');
    return response.data;
  },

  saveCombinedDraft: async (draftData: SaveWritingPracticeDraftRequest): Promise<void> => {
    await apiClient.put('/writing/combined/practice/save-draft', draftData);
  },

  submitCombinedPractice: async (submissionData: SubmitWritingPracticeRequest): Promise<WritingPart23ResultResponse> => {
    const response = await apiClient.post<WritingPart23ResultResponse>('/writing/combined/practice/submit', submissionData, { timeout: 120000 });
    return response.data;
  },

  getCombinedHistory: async (): Promise<DailyWritingPracticeHistoryResponse[]> => {
    const response = await apiClient.get<DailyWritingPracticeHistoryResponse[]>('/writing/combined/practice/history');
    return response.data;
  },
};