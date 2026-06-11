// file: services/dashboard.service.ts

import apiClient from './api';
import { DashboardSummaryResponse } from '../types/dashboard.type';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const response = await apiClient.get<DashboardSummaryResponse>('/dashboard/summary');
    return response.data;
  }
};