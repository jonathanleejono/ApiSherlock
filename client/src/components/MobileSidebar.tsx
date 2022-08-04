import Wrapper from "assets/wrappers/MobileSidebar";
import Logo from "components/Logo";
import NavLinks from "components/NavLinks";
import { toggleSidebar } from "features/user/userSlice";
import { FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "state/hooks";

const MobileSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const toggle = () => {
    dispatch(toggleSidebar());
  };

  const { isSidebarOpen } = useAppSelector((store) => store.user);
  return (
    <Wrapper>
      <div
        className={
          isSidebarOpen ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button type="button" className="close-btn" onClick={toggle}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks toggleSidebar={toggle} />
        </div>
      </div>
    </Wrapper>
  );
};

export default MobileSidebar;
