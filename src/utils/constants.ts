export const authRoutes = {
    register: "/auth/register",
    login: "/auth/login",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    googleLogin: "/auth/google",
    linkedinLogin: "/auth/linkedin"
}


export const adminRoutes = {
    login: "/admin/login",
    logout: "/admin/logout",
    getUsers: "/admin/users",
    updateUserStatus: "/admin/users/status/",
    getUserDetails:"/admin/users/",
    getDevelopers: "/admin/developers",
    getDeveloperRequests: "/admin/developer-requests",
    approveDeveloper: "/admin/developers",
    rejectDeveloper: "/admin/developers",
    getDeveloperDetails: "/admin/developers",
    getDeveloperRequestDetails: "/admin/developer-requests",
    getDashboardStats: "/admin/dashboard/stats",
    getRevenueStats: "/admin/revenue/stats",
    getSessions: "/admin/sessions",
    getDeveloperLeaderboard: "/admin/developers/leaderboard"
}

export const devAuthRoutes = {
    register: '/developer/auth/register',
    login: '/developer/auth/login',
    googleLogin: '/developer/google',
    verifyOtp: '/developer/auth/verify-otp',
    resendOtp: '/developer/auth/resend-otp',
    devRequest: '/developer/auth/dev-request',
    logout: '/developer/auth/logout'
}

export const userRoutes = {
    getProfile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password',
    searchDevelopers: '/users/developers/search',
    getPublicProfile: '/users/dev-profile'
}

export const developerRoutes = {
    getProfile: '/developer/profile',
    updateProfile: '/developer/profile',
    getProjects: '/developer/projects',
    addProject: '/developer/projects',
    editProject: '/developer/projects',
    deleteProject: '/developer/projects',
    availability: '/developer/availability',
    defaultAvailability: '/developer/default-availability',
    reviews: '/developer/reviews',
    dashboardStats: '/developer/dashboard/stats',
    upcomingSessions: '/developer/dashboard/upcoming'
}

export const sessionRoutes = {
    create: '/sessions',
    bookedSlots: '/sessions/booked-slots',
    userSessions: '/sessions/user',
    cancel: '/sessions',
    payment: '/sessions',
    upcoming: '/sessions/upcoming',
    details: '/sessions',
    developerRequests: '/sessions/developer/requests',
    developerScheduled: '/sessions/developer/scheduled',
    unavailableSlots: '/sessions/unavailable-slots',
    history: '/sessions/history',
    start: '/sessions',
    rate: '/sessions',
    developerHistory: '/sessions/developer/history'
}

export const chatRoutes = {
    create: '/chats',
    userChats: '/chats/user',
    developerChats: '/chats/developer',
    messages: '/chats',
    sendMessage: '/chats/message',
    markRead: '/chats'
}

export const videoSessionRoutes = {
    init: '/video-sessions',
    status: '/video-sessions',
    join: '/video-sessions',
    end: '/video-sessions',
    details: '/video-sessions',
    leave: '/video-sessions'
}

export const notificationRoutes = {
    getAll: '/notifications',
    unreadCount: '/notifications/unread-count',
    markRead: '/notifications',
    markAllRead: '/notifications/read-all',
    delete: '/notifications'
}

export const paymentRoutes = {
    createSession: '/payments/sessions',
    wallet: '/payments/wallet',
    adminWallet: '/payments/admin/wallet',
    transactions: '/payments/wallet/transactions'
}