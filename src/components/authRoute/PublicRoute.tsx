import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAppSelector((state) => state.user);

    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    if (isAuthenticated) {
        return <Navigate to={from} replace />
    }

    return <>{children}</>
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

