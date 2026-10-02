import apiClient from '../../shared/api/api';
import {
  VipDailyEntertainment,
  VipEntertainmentStatusInfo,
  VipSavedWord,
  VipSaveWordResponse,
  VipFomoCheck,
} from './vip.type';

export const vipService = {
  saveWord: async (word: string): Promise<VipSaveWordResponse> => {
    const response = await apiClient.post<VipSaveWordResponse>('/vip/save-word', { word });
    return response.data;
  },

  removeWord: async (word: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/vip/remove-word`, { params: { word } });
    return response.data;
  },

  getPendingWords: async (): Promise<VipSavedWord[]> => {
    const response = await apiClient.get<VipSavedWord[]>('/vip/pending-words');
    return response.data;
  },

  getDailyEntertainment: async (): Promise<VipDailyEntertainment> => {
    const response = await apiClient.get<VipDailyEntertainment>('/vip/daily-entertainment');
    return response.data;
  },

  completeStory: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>('/vip/complete-story');
    return response.data;
  },

  skipStory: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>('/vip/skip-story');
    return response.data;
  },

  requestEntertainmentGeneration: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>('/vip/entertainment/generate');
    return response.data;
  },

  getEntertainmentStatus: async (): Promise<VipEntertainmentStatusInfo> => {
    const response = await apiClient.get<VipEntertainmentStatusInfo>('/vip/entertainment-status');
    return response.data;
  },

  checkFomo: async (): Promise<VipFomoCheck> => {
    const response = await apiClient.get<VipFomoCheck>('/vip/check-fomo');
    return response.data;
  },
};