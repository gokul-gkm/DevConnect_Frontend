export interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  projectLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Developer {
  userId: {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
  };
  expertise: string[];
  hourlyRate: number;
  rating: number;
  education: {
    degree: string;
    institution: string;
    year: number;
  };
  totalSessions: number;
  portfolio: Project[];
  status: 'pending' | 'approved' | 'rejected';
  languages: string[];
  resume: string;
  workingExperience: {
    jobTitle: string;
    companyName: string;
    experience: number;
  };
  createdAt: Date;
  updatedAt: Date;
} 

