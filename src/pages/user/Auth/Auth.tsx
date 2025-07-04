import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { Background } from "@/components/ui/Background";

const Auth = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <Background>
        <div className="mt-20">
          <Outlet />
        </div>
      </Background>
      <Footer />
    </div>
  );
};

export default Auth;
