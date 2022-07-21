import { useAppSelector } from "src/hooks";
import Wrapper from "../assets/wrappers/BigSidebar";
import Logo from "../components/Logo";
import NavLinks from "./NavLinks";

const BigSidebar: React.FC = () => {
  const { isSidebarOpen } = useAppSelector((store) => store.user);
  return (
    <Wrapper>
      <div
        className={
          isSidebarOpen
            ? "sidebar-container "
            : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
