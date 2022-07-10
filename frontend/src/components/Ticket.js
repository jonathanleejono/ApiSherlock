import moment from "moment";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaLayerGroup,
  FaUserFriends,
  FaRegCreditCard,
} from "react-icons/fa";
import {
  BsPersonCircle,
  BsFillCalendar2PlusFill,
  BsClockFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/Ticket";
import TicketInfo from "./TicketInfo";
import TicketStatus from "./TicketStatus";
import TicketPriority from "./TicketPriority";

const Ticket = ({
  _id,
  ticketTitle,
  ticketDescription,
  ticketDueDate,
  ticketAssignees,
  ticketPriority,
  ticketType,
  ticketID,
  createdAt,
  ticketStatus,
}) => {
  const { setEditTicket, deleteTicket } = useAppContext();

  let date = moment(createdAt);
  date = date.format("MMM Do, YYYY");

  let createdDate = "Created Date: " + date;

  const { user } = useAppContext();

  const username = `Created By: ${user?.name}`;

  const assignedPeople = "Assignees: " + ticketAssignees;

  const ticketDeadline = "Due Date: " + ticketDueDate;

  const ticketTyping = "Ticket Type: " + ticketType;

  const ticketId = "Ticket ID: " + ticketID;

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{ticketTitle.charAt(0)}</div>
        <div className="info">
          <h4>{ticketTitle}</h4>
          <p>{ticketDescription}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <TicketInfo icon={<BsPersonCircle />} text={username} />
          <TicketInfo icon={<BsFillCalendar2PlusFill />} text={createdDate} />
          <TicketInfo icon={<FaUserFriends />} text={assignedPeople} />
          <TicketInfo icon={<FaCalendarAlt />} text={ticketDeadline} />
          <TicketInfo icon={<FaRegCreditCard />} text={ticketId} />
          <TicketInfo icon={<FaBriefcase />} text={ticketTyping} />
          <TicketPriority
            icon={<BsClockFill />}
            text="Priority:"
            ticketPriority={ticketPriority}
          />
          <TicketStatus
            icon={<FaLayerGroup />}
            text="Status:"
            ticketStatus={ticketStatus}
          />
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/add-ticket"
              className="btn edit-btn"
              onClick={() => setEditTicket(_id)}
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => deleteTicket(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Ticket;
