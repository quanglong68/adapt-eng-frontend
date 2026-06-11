import apiClient from './api';
import { KnowledgeMapResponse } from '../types/knowledge-map.type';

export const knowledgeMapService = {
  getKnowledgeMap: async (): Promise<KnowledgeMapResponse> => {
    const response = await apiClient.get<KnowledgeMapResponse>('/knowledge-map');
    return response.data;
  }
};