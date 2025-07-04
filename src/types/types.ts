export interface IRegisterData {
    username: string,
    email: string,
    contact: string,
    password: string,
    confirmPassword: string
}


export interface IAuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        username: string;
        email: string;
        contact: string;
        role: string,
        profilePicture?: string
    }
}

export interface IAdminAuthResponse {
    success: boolean;
    message: string;
    token?: string;
    admin?: {
        id: string;
        email: string;
    }
}

export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user';
    status: 'active' | 'blocked';
    isVerified: boolean;
    createdAt: string;
    contact: string;
    profilePicture?: string;
    bio?: string;
    skills?: string[];
    socialLinks?: {
        github?: string;
        linkedIn?: string;
        twitter?: string;
        portfolio?: string;
    }
}

export interface UsersResponse {
    users: User[];
    pagination: {
        total: number;
        pages: number;
        currentPage: number;
        limit: number;
    };
}


export interface SidebarProps {
    activeItem: string;
    setActiveItem: (item: string) => void;
  }
  
  export interface UserData {
    username: string;
    email: string;
    contact: string;
    location: string;
    bio: string;
    createdAt: string;
    totalSessions: number;
    skills: string[];
    languages: string[];
    socialLinks: {
      github?: string;
      linkedIn?: string;
      twitter?: string;
      portfolio?: string;
    };
    profilePicture: string;
}
  
interface BaseSession {
    id: string;
    developer: {
      name: string;
      avatar: string;
      role: string;
      status: 'online' | 'offline';
    };
    date: Date;
    time: string;
    duration: number;
    cost: number;
    topic?: string;
    description?: string;
  }

  export interface UpcomingSession extends BaseSession {
    status: 'pending' | 'scheduled' | 'cancelled' | 'approved';
  }
  

  export interface HistorySession extends BaseSession {
    status: 'completed' | 'cancelled';
}
  

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface DeveloperProfile {
  _id: string;
  username: string;
  email: string;
  contact?: string;
  location?: string;
  bio?: string;
  sessionCost: number;
  jobTitle?: string;
  company?: string;
  experience?: string;
  education?: Education;
  skills: string[];
  languages: string[];
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  profilePicture?: string;
  resumeUrl?: string;
  isVerified: boolean;
  rating?: number;
  totalSessions?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDeveloperProfileDto {
  username?: string;
  email?: string;
  contact?: string;
  location?: string;
  bio?: string;
  sessionCost?: number;
  jobTitle?: string;
  company?: string;
  experience?: string;
  education?: Education;
  skills?: string[];
  languages?: string[];
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

export interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  projectLink: string;
  createdAt: string;
  updatedAt: string;
}