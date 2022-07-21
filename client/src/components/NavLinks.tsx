import React from "react";
import { NavLink } from "react-router-dom";
import links from "../utils/links";

import PropTypes, { InferProps } from "prop-types";

const propTypes = {
  toggleSidebar: PropTypes.func,
};

type NavLinksProps = InferProps<typeof propTypes>;

//  the circle bracket is the first "return" --------------------v
const NavLinks: React.FC<NavLinksProps> = ({ toggleSidebar }) => (
  <div className="nav-links">
    {links.map((link) => {
      const { text, path, id, icon } = link;

      return (
        <NavLink
          to={path}
          key={id}
          onClick={() => toggleSidebar}
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span className="icon">{icon}</span>
          {text}
        </NavLink>
      );
    })}
  </div>
);

NavLinks.propTypes = propTypes;

export default NavLinks;
