import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";


const Auth = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
        <div className="mt-20">
          <Outlet />
        </div>
      <Footer />
    </div>
  );
};

export default Auth;
