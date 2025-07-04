export interface Session {
    _id: string;
    title: string;
    description: string;
    topics: string[];
    sessionDate: Date;
    startTime: Date;
    duration: number;
    price: number;
    status: SessionStatus;
    paymentStatus: PaymentStatus;
    developerId: string;
    userId: string;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export type SessionStatus = 
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'completed'
    | 'awaiting_payment';
  
  export type PaymentStatus = 'pending' | 'completed';
  
  export interface BookingFormData {
    title: string;
    description: string;
    topics: string[];
    time: string;
    duration: number;
  }
  
  export interface TimeSlot {
    time: string;
    value: string;
    available: boolean;
  }
  
  export interface BookedSlot {
    startTime: Date;
    duration: number;
  }