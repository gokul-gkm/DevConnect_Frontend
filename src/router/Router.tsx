import { createBrowserRouter } from 'react-router-dom';
import { DevPublicRoute, PublicRoute } from '@/hoc/authRoute/PublicRoute';
import { AdminProtectedRoute, ProtectedRoute } from '@/hoc/authRoute/ProtectedRoute';
import Auth from '../pages/user/Auth/Auth';
import UserRegisterPage  from '@/pages/user/Auth/RegisterPage';
import UserLoginPage from '@/pages/user/Auth/LoginPage';
import UserOTPPage from '@/pages/user/Auth/OTPPage';
import UserForgotPassword from '@/pages/user/Auth/ForgotPassword';
import UserResetPassword from '@/pages/user/Auth/ResetPassword';
import LinkedInCallback from '@/components/user/auth/LinkedInCallback';
import RootPage from '@/pages/user/Home/RootPage';
import NotFound from '@/components/user/NotFoundPage';

import UserProfilePage  from '@/pages/user/Profile/UserProfilePage';
import EditProfilePage from '@/pages/user/Profile/EditProfilePage';
import ChangePasswordPage from '@/pages/user/Profile/ChangePasswordPage';
import UpcomingSessionsPage  from '@/pages/user/Sessions/UpcomingSessionsPage';
import SessionHistoryPage  from '@/pages/user/Sessions/SessionHistorypage';

import AdminLoginPage from '@/pages/admin/Auth/AdminLogin';
import Dashboard from '@/pages/admin/Dashboard/Dashboard';
import AdminLayout from '@/components/layout/AdminLayout';
import UsersListPage from '@/pages/admin/Users/AdminUsers';
import AdminDeveloperPage from '@/pages/admin/Developers/AdminDevelopers';
import AdminNotFoundPage from '@/components/layout/AdminNotFoundPage';
import DevDetails from '@/pages/admin/Developers/DevDetails';
import UserDetails from '@/pages/admin/Users/UserDetails';
import DeveloperRequestsPage from '@/pages/admin/Developers/DevRequests';
import DevRequestDetails from '@/pages/admin/Developers/DevRequestDetails';

import DevRegisterPage from '@/pages/developer/Auth/DevRegister';
import DevAuth from '@/pages/developer/Auth/DevAuth';
import DevOTPPage from '@/pages/developer/Auth/DevOTPPage';
import DevLogin from '@/pages/developer/Auth/DevLogin';
import DeveloperRequestPage from '@/pages/developer/Auth/DevRequestPage';

import DevDashboard from '@/pages/developer/Home/Dashboard';
import DeveloperProfilePage from '@/pages/developer/Profile/DeveloperProfilePage';
import EditDeveloperProfilePage from '@/pages/developer/Profile/EditDeveloperProfilePage';
import DevPortfolioPage from '@/pages/developer/Portfolio/DevPortfolioPage';
import AddProjectPage from '@/pages/developer/Portfolio/AddProjectPage';
import EditProjectPage from '@/pages/developer/Portfolio/EditProjectPage';
import SearchDevelopersPage from '@/pages/user/developers/SearchDeveloperPage';
import DeveloperPublicProfilePage from '@/pages/user/developers/DeveloperPublicProfilePage';
import SessionBookingPage from '@/pages/user/Sessions/SessionBookingPage';
import SessionsPage from '@/pages/user/session/SessionPage';
import SessionRequestPage from '@/pages/developer/Sessions/SessionRequestPage';
import SessionDetailsPage from '@/pages/user/Sessions/SessionDetailsPage';
import PaymentSuccess from '@/components/user/payments/PaymentSuccess';
import PaymentCancel from '@/components/user/payments/PaymentCancel';
import { AdminWallet } from '@/components/admin/wallet/AdminWallet';
import DeveloperWalletPage from '@/pages/developer/Wallet/DeveloperWalletPage';
import UserWalletPage from '@/pages/user/Wallet/UserWalletPage';
import { Role } from '@/types/types';
import ChatPage from '@/pages/chat/ChatPage';
import DeveloperChatPage from '@/pages/chat/DeveloperChatPage';
import UserNotificationPage from '@/pages/user/Notification/NotificationPage';
import DeveloperNotificationPage from '@/pages/developer/Notification/DeveloperNotificationPage';
import AboutUs from '@/pages/user/AboutUs/AboutUs';
import SessionRequestDetailsPage from '@/pages/developer/Sessions/SessionRequestDetailsPage';
import ScheduledSessionsPage from '@/pages/developer/Sessions/ScheduledSessionsPage';
import ScheduledSessionsDetailsPage from '@/pages/developer/Sessions/ScheduledSessionsDetailsPage';
import VideoCall from '@/components/video-chat/VideoCall';


export const Router = createBrowserRouter([
    
    {
        path: '/auth',
        element: <Auth/>,
        children: [
            {
                path: 'register',
                element: <PublicRoute routeType={Role.USER}><UserRegisterPage/></PublicRoute> 
            },
            {
                path: 'login',
                element:<PublicRoute routeType={Role.USER}> <UserLoginPage/></PublicRoute>
            },
            {
                path: 'verify-otp',
                element: <PublicRoute routeType={Role.USER}><UserOTPPage/></PublicRoute>
            },
            {
                path: 'forgot-password',
                element: <PublicRoute routeType={Role.USER}><UserForgotPassword/></PublicRoute>
            },
            {
                path: 'reset-password',
                element: <PublicRoute routeType={Role.USER}><UserResetPassword/></PublicRoute>
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
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><DevDashboard/></ProtectedRoute>
            },
            {
                path: 'profile',
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><DeveloperProfilePage/></ProtectedRoute>
            },
            {
                path: 'edit-profile',
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><EditDeveloperProfilePage/></ProtectedRoute>
            },
            {
                path: 'portfolio',
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><DevPortfolioPage /></ProtectedRoute>,
            },
            {
                path: 'portfolio/add-project',
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><AddProjectPage/></ProtectedRoute>
            },
            {
                path: 'portfolio/projects/edit/:projectId',
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><EditProjectPage/></ProtectedRoute> 
            },
            {
                path: 'session-requests',
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><SessionRequestPage/></ProtectedRoute>
            },
            {
                path: 'session-requests/:sessionId',
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><SessionRequestDetailsPage/></ProtectedRoute>
            },
            {
                path: 'sessions/scheduled',
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><ScheduledSessionsPage/></ProtectedRoute>
            },
            {
                path: 'sessions/scheduled/:sessionId',
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><ScheduledSessionsDetailsPage/></ProtectedRoute>
            },
            {
                path: 'wallet',
                element: <ProtectedRoute allowedRole={Role.DEVELOPER}><DeveloperWalletPage/></ProtectedRoute>
            },      
            {
                path: 'notifications',
                element:
                    <ProtectedRoute allowedRole={Role.DEVELOPER}>
                    <DeveloperNotificationPage />
                </ProtectedRoute>
            },      
        ]
    },

    {
        path: 'developer/chats',
        element: <ProtectedRoute allowedRole={Role.DEVELOPER}><DeveloperChatPage/></ProtectedRoute>
    },
    {
        path: 'developer/chats/:chatId',
        element: <ProtectedRoute allowedRole={Role.DEVELOPER}><DeveloperChatPage/></ProtectedRoute>
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
                path: 'wallet',
                element: <AdminProtectedRoute><AdminWallet/></AdminProtectedRoute>
            },
            {
                path: '*',
                element: <AdminNotFoundPage/>
            },           
        ]

    },
    {
        path: "/linkedin-callback",
        element: <LinkedInCallback />
    },
    {
        path: 'profile',
        element: <ProtectedRoute allowedRole={Role.USER}><UserProfilePage/></ProtectedRoute>
    },
    {
        path: 'edit-profile',
        element: <ProtectedRoute allowedRole={Role.USER}><EditProfilePage/></ProtectedRoute>
    },
    {
        path: 'change-password',
        element: <ProtectedRoute allowedRole={Role.USER}><ChangePasswordPage/></ProtectedRoute>
    },
    {
        path: 'wallet',
        element: <ProtectedRoute allowedRole={Role.USER}><UserWalletPage/></ProtectedRoute>
    },
    {
        path: 'about',
        element: <AboutUs/>
    },
    {
        path: '/',
        element: <RootPage/>
    },
    {
        path: 'video-call',
        element: <VideoCall/>
    },

    {
        path: 'sessions',
        children: [
            {
                path: 'upcoming',
                element: <ProtectedRoute allowedRole={Role.USER}><UpcomingSessionsPage/></ProtectedRoute> 
            },
            {
                path: 'history',
                element: <ProtectedRoute allowedRole={Role.USER}><SessionHistoryPage/></ProtectedRoute>
            },
            {
                path: 'booking/:developerId',
                element: <ProtectedRoute allowedRole={Role.USER}><SessionBookingPage/></ProtectedRoute>
            },
            {
                path: 'my-sessions',
                element: <ProtectedRoute allowedRole={Role.USER}><SessionsPage/></ProtectedRoute>
            },
            
            
        ],
    },
    {
        path: 'sessions/:sessionId',
        element: <ProtectedRoute allowedRole={Role.USER}><SessionDetailsPage/></ProtectedRoute>
    },

    {
        path: 'search-developers',
        element: <SearchDevelopersPage/>
    },
    {
        path: 'dev-profile/:developerId',
        element: <DeveloperPublicProfilePage/>
    },

    {
        path: '/payment/success',
        element:<ProtectedRoute allowedRole={Role.USER}> <PaymentSuccess/></ProtectedRoute>
    },
    {
        path: '/payment/cancel',
        element: <ProtectedRoute allowedRole={Role.USER}><PaymentCancel/></ProtectedRoute>
    },
    {
        path: '/chats',
        element: <ProtectedRoute allowedRole={Role.USER}> <ChatPage/></ProtectedRoute>
    },
    {
        path: '/chats/:chatId',
        element: <ProtectedRoute allowedRole={Role.USER}><ChatPage/></ProtectedRoute>
    },
    {
        path: '/notifications',
        element: <ProtectedRoute allowedRole={Role.USER}><UserNotificationPage/></ProtectedRoute>
    },
    {
        path: '*',
        element: <NotFound/>
    }
])