import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'user' | 'developer';
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAppSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (role !== allowedRole) {
    const redirectPath = role === 'developer' ? '/developer/dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};



// import { Navigate, useLocation } from "react-router-dom";
// import { useAppSelector } from "@/hooks/useAppSelector";

// export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//     const { isAuthenticated } = useAppSelector((state) => state.user);

//     const location = useLocation();

//     if (!isAuthenticated) {
//         return <Navigate to="/auth/login" state={{ from: location }} replace />
//     }
//     return <>{children}</>
// };


export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { email } = useAppSelector((state) => state.admin);

    const location = useLocation();

    if (!email) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />
    }
    return <>{children}</>
};
