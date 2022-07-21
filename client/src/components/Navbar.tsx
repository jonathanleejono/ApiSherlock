import { useState } from "react";
import { FaAlignLeft, FaCaretDown, FaUserCircle } from "react-icons/fa";
import { logoutUser, toggleSidebar } from "src/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "src/hooks";
import Wrapper from "../assets/wrappers/Navbar";
import Logo from "./Logo";
const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useAppSelector((store) => store.user);

  const toggle = () => {
    dispatch(toggleSidebar());
  };

  const logout = () => {
    dispatch(logoutUser("Logging out..."));
  };

  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggle}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h3 className="logo-text">dashboard</h3>
        </div>
        <div className="btn-container">
          <button
            type="button"
            className="btn"
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {user?.name}
            <FaCaretDown />
          </button>
          <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
            <button type="button" className="dropdown-btn" onClick={logout}>
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
