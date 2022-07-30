import { FaTimes } from "react-icons/fa";
import Wrapper from "../assets/wrappers/MobileSidebar";

import Logo from "./Logo";
import NavLinks from "./NavLinks";

import { toggleSidebar } from "features/user/userSlice";
import { useAppDispatch, useAppSelector } from "hooks";

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
