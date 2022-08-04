import Wrapper from "assets/wrappers/Navbar";
import Logo from "components/Logo";
import { toggleSidebar } from "features/user/userSlice";
import { clearStore } from "features/user/userThunk";
import { useState } from "react";
import { FaAlignLeft, FaCaretDown, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { removeUserFromLocalStorage } from "utils/localStorage";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useAppSelector((store) => store.user);

  const toggle = () => {
    dispatch(toggleSidebar());
  };

  const logout = async () => {
    dispatch(clearStore());
    removeUserFromLocalStorage();
    toast.success("Logging out...");
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
