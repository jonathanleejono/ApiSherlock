import Wrapper from "../assets/wrappers/TicketStatus";

const TicketStatus = ({ icon, text, ticketStatus }) => {
  //combining the .status and ${status} classes together
  return (
    <Wrapper>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
      <span className={`status ${ticketStatus}`}>{ticketStatus}</span>
    </Wrapper>
  );
};

export default TicketStatus;
