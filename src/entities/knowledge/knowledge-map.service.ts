import apiClient from '../../shared/api/api';
import { KnowledgeMapResponse } from './knowledge-map.type';

export const knowledgeMapService = {
  getKnowledgeMap: async (): Promise<KnowledgeMapResponse> => {
    const response = await apiClient.get<KnowledgeMapResponse>('/knowledge-map');
    return response.data;
  }
};