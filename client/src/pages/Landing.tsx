import main from "../assets/images/main.png";
import Wrapper from "../assets/wrappers/LandingPage";
import { Logo } from "../components";
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
            Create and manage tickets for any aspect of your product or team.
            Identify issues, request features, and discuss bug fixes all in one
            place. Set priority for your most important tickets, and assign them
            to your teammates.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img src={main} alt="finding issues" className="img main-img" />
      </div>
    </Wrapper>
  );

export default Landing;
