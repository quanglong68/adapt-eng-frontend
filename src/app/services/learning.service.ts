import apiClient from './api';
import { SaveWordRequest, SaveWordResponse } from '../types/learning.type';

export const learningService = {
  saveWord: async (payload: SaveWordRequest): Promise<SaveWordResponse> => {
    const response = await apiClient.post<SaveWordResponse>('/learning/save-word', payload);
    return response.data;
  },
};
