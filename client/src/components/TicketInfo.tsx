import Wrapper from "../assets/wrappers/TicketInfo";
import React from "react";

const TicketInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </Wrapper>
  );
};

export default TicketInfo;
