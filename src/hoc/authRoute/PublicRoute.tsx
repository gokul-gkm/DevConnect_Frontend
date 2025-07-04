import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Role } from "@/types/types";

interface PublicRouteProps {
  children: React.ReactNode;
  routeType: Role;
}

export const PublicRoute = ({ children, routeType }: PublicRouteProps) => {
  const { isAuthenticated, role } = useAppSelector((state) => state.user);
  const location = useLocation();
  const from = location.state?.from?.pathname;

  if (isAuthenticated) {
    if (routeType === 'developer' && role === Role.DEVELOPER) {
      return <Navigate to={from || '/developer/dashboard'} replace />;
    }
    if (routeType === 'user' && role === Role.USER) {
      return <Navigate to={from || '/'} replace />;
    }
    return <Navigate to={role === Role.DEVELOPER ? '/developer/dashboard' : '/'} replace />;
  }

  return <>{children}</>;
};




export const DevPublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAppSelector((state) => state.user);

    const location = useLocation();
    const from = location.state?.from?.pathname || '/developer/dashboard';
    if (isAuthenticated) {
        return <Navigate to={from} replace />
    }

    return <>{children}</>
};

