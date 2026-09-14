
import apiClient from './api';
import { NotificationResponse } from '../types/notification.type';

export const notificationService = {
    getNotifications: async (): Promise<NotificationResponse> => {
        const response = await apiClient.get<NotificationResponse>('/notifications');
        return response.data;
    },

    markAsRead: async (id: string): Promise<void> => {
        await apiClient.put(`/notifications/${id}/read`);
    },
markAllAsRead: async (): Promise<void> => {
    await apiClient.put(`/notifications/read-all`);
}
};