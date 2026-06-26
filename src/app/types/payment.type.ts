export interface CreatePaymentUrlRequest {
  packageId: number;
}

export interface CreatePaymentUrlResponse {
  vnpayUrl: string;
  transactionCode: string;
  hasActiveVip: boolean;
  warningMessage: string | null;
}

export interface SubscriptionPackageOption {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  description: string;
}

export interface TransactionHistoryItem {
  id: number;
  transactionCode: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED';
  createdAt: string;
  vnpayUrl: string;
  packageName: string | null;
}