import { Link } from "react-router-dom";
import { pingAll } from "src/features/ping/pingSlice";
import { useAppDispatch } from "src/hooks";
import { ApisContainer, SearchContainer } from "../../components";

const AllApis = () => {
  const dispatch = useAppDispatch();

  const pingApis = () => {
    dispatch(pingAll());
  };
  return (
    <>
      <SearchContainer />
      <Link to="/add-api" className="btn btn-api">
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
