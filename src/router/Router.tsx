import { createBrowserRouter } from 'react-router-dom';
import Auth from '../pages/user/Auth/Auth';
import { UserRegisterPage } from '@/pages/user/Auth/RegisterPage';
import Home from '../pages/user/Home/Home';
import { UserLoginPage } from '@/pages/user/Auth/LoginPage';
import { UserOTPPage } from '@/pages/user/Auth/OTPPage';
import { UserForgotPassword } from '@/pages/user/Auth/ForgotPassword';
import { UserResetPassword } from '@/pages/user/Auth/ResetPassword';


export const Router = createBrowserRouter([
    {
        path: '/auth',
        element: <Auth/>,
        children: [
            {
                path: 'register',
                element: <UserRegisterPage/>
            },
            {
                path: 'login',
                element: <UserLoginPage/>
            },
            {
                path: 'verify-otp',
                element: <UserOTPPage/>
            },
            {
                path: 'forgot-password',
                element: <UserForgotPassword/>
            },
            {
                path: 'reset-pasword',
                element: <UserResetPassword/>
            },
            
        ]
    },
    {
        path: '/',
        element: <Home/>
    }
])