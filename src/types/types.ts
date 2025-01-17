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
    bio?: string
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