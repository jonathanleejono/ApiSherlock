import main from "assets/images/main.png";
import Wrapper from "assets/wrappers/LandingPage";
import { Logo } from "components";
import { registerRoute } from "constants/routes";
import { Link } from "react-router-dom";
const Landing = () => (
  <Wrapper>
    <nav>
      <Logo />
    </nav>
    <div className="container page">
      <div className="info">
        <h1>
          api <span>tracking</span> app
        </h1>
        <p>
          Manage all your API links in one platform. Ping APIs to monitor their
          status, and have full visibility of where each API is hosted. Built on
          React, Redux, Node, Express, Typescript, and MongoDB.
        </p>
        <Link to={registerRoute} className="btn btn-hero">
          Login/Register
        </Link>
      </div>
      <img src={main} alt="api tracking main image" className="img main-img" />
    </div>
  </Wrapper>
);

export default Landing;
