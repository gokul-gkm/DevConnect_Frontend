export interface PaymentSession {
    id: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    sessionId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type PaymentStatus = 
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'refunded';
  
  export interface CreatePaymentSessionResponse {
    url: string;
    sessionId: string;
  }
  
  export interface WalletTransaction {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    status: 'completed' | 'pending' | 'failed';
    sessionId: string;
    createdAt: Date;
  }
  
  export interface Wallet {
    id: string;
    balance: number;
    transactions: WalletTransaction[];
    userId: string;
  }