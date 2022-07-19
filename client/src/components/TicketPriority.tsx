import Wrapper from "../assets/wrappers/TicketPriority";
import React from "react";

const TicketPriority = ({ icon, text, ticketPriority }) => {
  //combining the .status and .Priority classes together
  return (
    <Wrapper>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
      <span className={`status ${ticketPriority}`}>{ticketPriority}</span>
    </Wrapper>
  );
};

export default TicketPriority;
