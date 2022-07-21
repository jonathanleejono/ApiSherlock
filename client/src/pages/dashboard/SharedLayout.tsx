import { Outlet } from "react-router-dom";
import Wrapper from "../../assets/wrappers/SharedLayout";
import { Navbar, BigSidebar, MobileSidebar } from "../../components";

const SharedLayout = () => (
    <Wrapper>
      <main className="dashboard">
        <MobileSidebar />
        <BigSidebar />
        <div>
          <Navbar />
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );

export default SharedLayout;
