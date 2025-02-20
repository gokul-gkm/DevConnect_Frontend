import { useAppSelector } from "@/hooks/useAppSelector";
import { ProtectedRoute } from "@/hoc/authRoute/ProtectedRoute";
import Home from "./Home";
import LandingHome from "./LandingHome";

const RootPage = () => {
    const { isAuthenticated } = useAppSelector((state) => state.user);

    return isAuthenticated ? (
        <ProtectedRoute allowedRole="user">
            <Home />
        </ProtectedRoute>
    ) : (
        <LandingHome />
    );
};

export default RootPage;