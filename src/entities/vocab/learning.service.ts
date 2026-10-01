import apiClient from '../../shared/api/api';
import { SaveWordRequest, SaveWordResponse } from './learning.type';

export const learningService = {
  saveWord: async (payload: SaveWordRequest): Promise<SaveWordResponse> => {
    const response = await apiClient.post<SaveWordResponse>('/learning/save-word', payload);
    return response.data;
  },
};
