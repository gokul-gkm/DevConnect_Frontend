import { useAppSelector } from "@/hooks/useAppSelector";
import { ProtectedRoute } from "@/components/authRoute/ProtectedRoute";
import Home from "./Home";
import LandingHome from "./LandingHome";

const RootPage = () => {
    const { isAuthenticated } = useAppSelector((state) => state.user);

    return isAuthenticated ? (
        <ProtectedRoute>
            <Home />
        </ProtectedRoute>
    ) : (
        <LandingHome />
    );
};

export default RootPage;