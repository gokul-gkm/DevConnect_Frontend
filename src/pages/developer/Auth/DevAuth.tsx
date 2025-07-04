import { Outlet } from "react-router-dom";
import DevNavbar from "@/components/layout/DevNavbar";
import { Footer } from "@/components/layout/Footer";

// import { Background } from "@/components/ui/Background";

const DevAuth = () => {
  return (
    <div>
      <div>
        <DevNavbar />
      </div>
      {/* <Background> */}
        <div className="mt-20">
          <Outlet />
        </div>
      {/* </Background> */}
      <Footer />
    </div>
  );
};

export default DevAuth;