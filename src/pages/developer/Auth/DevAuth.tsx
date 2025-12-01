import { Outlet } from "react-router-dom";
import DevNavbar from "@/components/layout/DevNavbar";
import { Footer } from "@/components/layout/Footer";


const DevAuth = () => {
  return (
    <div>
      <div>
        <DevNavbar />
      </div>

        <div className="mt-20">
          <Outlet />
        </div>
      <Footer />
    </div>
  );
};

export default DevAuth;