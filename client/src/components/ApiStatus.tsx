import Wrapper from "../assets/wrappers/ApiStatus";
import React from "react";

interface ApiStatusProps {
  icon: JSX.Element;
  text: string;
  apiStatus: string;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ icon, text, apiStatus }) => (
  //combining the .status and ${status} classes together
  <Wrapper>
    <span className="icon">{icon}</span>
    <span className="text">{text}</span>
    <span className={`status ${apiStatus}`}>{apiStatus}</span>
  </Wrapper>
);

export default ApiStatus;
