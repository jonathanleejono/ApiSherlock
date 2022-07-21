import Wrapper from "../assets/wrappers/ApiInfo";
import React from "react";

interface ApiProps {
  icon: JSX.Element;
  text: string;
}

const ApiInfo: React.FC<ApiProps> = ({ icon, text }) => (
  <Wrapper>
    <span className="icon">{icon}</span>
    <span className="text">{text}</span>
  </Wrapper>
);

export default ApiInfo;
