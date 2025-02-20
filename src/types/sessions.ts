export interface Developer {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
    developerProfile: {
      experience: number;
      hourlyRate: number;
      skills: string[];
      bio: string;
    };
  }
  
  export interface Session {
    _id: string;
    title: string;
    description: string;
    sessionDate: string;
    startTime: string;
    duration: number;
    price: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'awaiting_payment';
    paymentStatus: 'pending' | 'completed';
    topics: string[];
    developerId: Developer;
  }