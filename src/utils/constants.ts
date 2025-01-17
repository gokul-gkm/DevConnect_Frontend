export const authRoutes = {
    register: "/auth/register",
    login: "/auth/login",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    googleLogin: "/auth/google"
}


export const adminRoutes = {
    login: "/admin/login",
    logout: "/admin/logout",
    getUsers: "/admin/users",
    updateUserStatus: "/admin/users/status/",
    getUserDetails:"/admin/users/"
}

export const devAuthRoutes = {
    register: '/developer/auth/register',
    login: '/developer/auth/login',
    googleLogin: '/developer/google',
    verifyOtp: '/developer/auth/verify-otp',
    resendOtp: '/developer/auth/resend-otp',
    devRequest: '/developer/auth/dev-request'
}