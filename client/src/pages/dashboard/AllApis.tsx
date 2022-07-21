import { ApisContainer, SearchContainer } from "../../components";
import { Link } from "react-router-dom";
import React from "react";

const AllApis = () => (
    <>
      <SearchContainer />
      <Link to="/add-api" className="btn btn-api">
        Add Api
      </Link>
      <ApisContainer />
    </>
  );

export default AllApis;
