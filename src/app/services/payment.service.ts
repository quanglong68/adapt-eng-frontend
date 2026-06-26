import apiClient from './api';
import {
  CreatePaymentUrlRequest,
  CreatePaymentUrlResponse,
  SubscriptionPackageOption,
  TransactionHistoryItem,
} from '../types/payment.type';

export const MOCK_PACKAGES: SubscriptionPackageOption[] = [
  {
    id: 1,
    name: '1 Month',
    price: 50000,
    durationDays: 30,
    description: 'VIP truy cập đầy đủ tính năng AI trong 30 ngày',
  },
  {
    id: 2,
    name: '6 Months',
    price: 250000,
    durationDays: 180,
    description: 'Tiết kiệm hơn với gói VIP 6 tháng — ôn tập AI không giới hạn',
  },
];

export const paymentService = {
  createPaymentUrl: async (payload: CreatePaymentUrlRequest): Promise<CreatePaymentUrlResponse> => {
    const response = await apiClient.post<CreatePaymentUrlResponse>('/payment/create-url', payload);
    return response.data;
  },

  verifyPayment: async (params: Record<string, string>): Promise<{ success: boolean; message: string }> => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get<{ success: boolean; message: string }>(`/payment/vnpay-return?${queryString}`);
    return response.data;
  },

  cancelTransaction: async (transactionId: number): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>(`/payment/cancel/${transactionId}`);
    return response.data;
  },

  getTransactionHistory: async (): Promise<TransactionHistoryItem[]> => {
    const response = await apiClient.get<TransactionHistoryItem[]>('/payment/history');
    return response.data;
  },
};
