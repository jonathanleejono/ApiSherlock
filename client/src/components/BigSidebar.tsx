import Wrapper from "assets/wrappers/BigSidebar";
import Logo from "components/Logo";
import NavLinks from "components/NavLinks";
import { useAppSelector } from "state/hooks";

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
