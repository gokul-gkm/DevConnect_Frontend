import { createBrowserRouter } from 'react-router-dom';
import Auth from '../pages/user/Auth/Auth';
import { UserRegisterPage } from '@/pages/user/Auth/RegisterPage';
import { UserLoginPage } from '@/pages/user/Auth/LoginPage';
import { UserOTPPage } from '@/pages/user/Auth/OTPPage';
import { UserForgotPassword } from '@/pages/user/Auth/ForgotPassword';
import { UserResetPassword } from '@/pages/user/Auth/ResetPassword';
import { DevPublicRoute, PublicRoute } from '@/components/authRoute/PublicRoute';
import RootPage from '@/pages/user/Home/RootPage';
import NotFound from '@/components/user/NotFoundPage';
import { AdminLoginPage } from '@/pages/admin/Auth/AdminLogin';
import Dashboard from '@/pages/admin/Dashboard/Dashboard';
import AdminLayout from '@/components/layout/AdminLayout';
import { UsersListPage } from '@/pages/admin/Users/AdminUsers';
import { AdminProtectedRoute, ProtectedRoute } from '@/components/authRoute/ProtectedRoute';
import { LinkedInCallback } from '@/components/user/auth/LinkedInCallback';
import AdminDeveloperPage from '@/pages/admin/Developers/AdminDevelopers';
import AdminNotFoundPage from '@/components/layout/AdminNotFoundPage';
import DevDetails from '@/pages/admin/Developers/DevDetails';
import UserDetails from '@/pages/admin/Users/UserDetails';
import { DeveloperRequestsPage } from '@/pages/admin/Developers/DevRequests';
import DevRequestDetails from '@/pages/admin/Developers/DevRequestDetails';
import { DevRegisterPage } from '@/pages/developer/Auth/DevRegister';
import DevAuth from '@/pages/developer/Auth/DevAuth';
import { DevOTPPage } from '@/pages/developer/Auth/DevOTPPage';
import { DevLogin } from '@/pages/developer/Auth/DevLogin';
import DeveloperRequestPage from '@/pages/developer/Auth/DevRequestPage';
import DevDashboard from '@/pages/developer/Home/Dashboard';


export const Router = createBrowserRouter([
    {
        path: '/auth',
        element: <Auth/>,
        children: [
            {
                path: 'register',
                element: <PublicRoute><UserRegisterPage/></PublicRoute> 
            },
            {
                path: 'login',
                element:<PublicRoute> <UserLoginPage/></PublicRoute>
            },
            {
                path: 'verify-otp',
                element: <PublicRoute><UserOTPPage/></PublicRoute>
            },
            {
                path: 'forgot-password',
                element: <PublicRoute><UserForgotPassword/></PublicRoute>
            },
            {
                path: 'reset-password',
                element: <PublicRoute><UserResetPassword/></PublicRoute>
            },
           
        ]
    },
    {
        path: 'developer',
        element: <DevAuth/>,
        children: [
            {
                path: 'auth',
                children: [
                    {
                        path: 'register',
                        element: <DevPublicRoute><DevRegisterPage/></DevPublicRoute>
                    },
                    {
                        path: 'verify-otp',
                        element: <DevPublicRoute><DevOTPPage/></DevPublicRoute>
                    },
                    {
                        path: 'login',
                        element: <DevPublicRoute><DevLogin/></DevPublicRoute>
                    },
                    {
                        path: 'dev-request',
                        element: <DevPublicRoute><DeveloperRequestPage/></DevPublicRoute>
                    }
                ]
            },
            {
                path: 'dashboard',
                element: <ProtectedRoute><DevDashboard/></ProtectedRoute>
            }
        ]
    },
    {
        path: 'admin',
        children: [
            {
                path: 'login',
                element: <AdminLoginPage/>
            }
        ]    
    },
    {
        path: '/admin',
        element: <AdminLayout/>,
        children: [
          
            {
                path: 'dashboard',
                element: <AdminProtectedRoute><Dashboard/></AdminProtectedRoute>
            },
            {
                path: 'users',
                element: <AdminProtectedRoute><UsersListPage/> </AdminProtectedRoute>
            },
            {
                path: 'users/:userId',
                element: <AdminProtectedRoute> <UserDetails/></AdminProtectedRoute>
            },
            {
                path: 'developers',
                element: <AdminProtectedRoute><AdminDeveloperPage /></AdminProtectedRoute>,
                   
            },
            {
                path: 'developers/:id',
                element: <AdminProtectedRoute><DevDetails/></AdminProtectedRoute>
            },
            {
                path: 'developers/requests',
                element: <AdminProtectedRoute><DeveloperRequestsPage /></AdminProtectedRoute>,
                   
            },
            {
                path: 'developer-requests/:id',
                element: <AdminProtectedRoute><DevRequestDetails/></AdminProtectedRoute>
            },
            {
                path: '*',
                element: <AdminNotFoundPage/>
            }
        ]

    },
    {
        path: "/linkedin-callback",
        element: <LinkedInCallback />
    },
    {
        path: '/',
        element: <RootPage/>
    },
    {
        path: '*',
        element: <NotFound/>
    }
])