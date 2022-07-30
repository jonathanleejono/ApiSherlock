import { Link } from "react-router-dom";
import { pingAll } from "features/ping/pingSlice";
import { useAppDispatch } from "hooks";
import { ApisContainer, SearchContainer } from "../../components";

const AllApis = () => {
  const dispatch = useAppDispatch();

  const pingApis = () => {
    dispatch(pingAll());
  };

  return (
    <>
      <SearchContainer />
      <Link to="/add-api" className="btn btn-api" aria-label="Add Api button">
        Add Api
      </Link>
      <button type="button" className="btn btn-ping" onClick={pingApis}>
        Ping All
      </button>
      <ApisContainer />
    </>
  );
};

export default AllApis;
