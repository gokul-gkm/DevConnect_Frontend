import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";

interface PublicRouteProps {
  children: React.ReactNode;
  routeType: 'user' | 'developer';
}

export const PublicRoute = ({ children, routeType }: PublicRouteProps) => {
  const { isAuthenticated, role } = useAppSelector((state) => state.user);
  const location = useLocation();
  const from = location.state?.from?.pathname;

  if (isAuthenticated) {
    if (routeType === 'developer' && role === 'developer') {
      return <Navigate to={from || '/developer/dashboard'} replace />;
    }
    if (routeType === 'user' && role === 'user') {
      return <Navigate to={from || '/'} replace />;
    }
    // If authenticated but wrong role type, redirect to appropriate dashboard
    return <Navigate to={role === 'developer' ? '/developer/dashboard' : '/'} replace />;
  }

  return <>{children}</>;
};




// import { Navigate, useLocation } from "react-router-dom";
// import { useAppSelector } from "@/hooks/useAppSelector";

// export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
//     const { isAuthenticated } = useAppSelector((state) => state.user);

//     const location = useLocation();
//     const from = location.state?.from?.pathname || '/';
//     if (isAuthenticated) {
//         return <Navigate to={from} replace />
//     }

//     return <>{children}</>
// };



export const DevPublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAppSelector((state) => state.user);

    const location = useLocation();
    const from = location.state?.from?.pathname || '/developer/dashboard';
    if (isAuthenticated) {
        return <Navigate to={from} replace />
    }

    return <>{children}</>
};

