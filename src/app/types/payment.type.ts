export interface CreatePaymentUrlRequest {
  packageId: number;
}

export interface CreatePaymentUrlResponse {
  vnpayUrl: string;
  transactionCode: string;
}

export interface SubscriptionPackageOption {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  description: string;
}
