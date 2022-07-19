import { TicketsContainer, SearchContainer } from "../../components";
import { Link } from "react-router-dom";
import React from "react";

const AllTickets = () => {
  return (
    <>
      <SearchContainer />
      <Link to="/add-ticket" className="btn btn-ticket">
        Create Ticket
      </Link>
      <TicketsContainer />
    </>
  );
};

export default AllTickets;
