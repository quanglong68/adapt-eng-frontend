// file: services/dashboard.service.ts

import apiClient from '../../shared/api/api';
import { DashboardSummaryResponse } from './dashboard.type';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const response = await apiClient.get<DashboardSummaryResponse>('/dashboard/summary');
    return response.data;
  }
};