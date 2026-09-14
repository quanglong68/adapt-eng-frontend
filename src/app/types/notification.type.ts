
export type NotificationType = 'SYSTEM' | 'AI_DEEP_DIVE' | 'BILLING' | 'PRACTICE_REMINDER';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    actionUrl?: string;
    createdAt: string;
}

export interface NotificationResponse {
    unreadCount: number;
    notifications: AppNotification[];
}