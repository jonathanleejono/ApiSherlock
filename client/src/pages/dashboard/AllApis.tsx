import { ApisContainer, SearchContainer } from "components";
import {
  getAllApisErrorMsg,
  pingAllApisErrorMsg,
  pingAllApisSuccessMsg,
} from "constants/messages";
import { addApiRoute } from "constants/routes";
import { getAllApis } from "features/allApis/allApisThunk";
import { pingAll } from "features/ping/pingThunk";
import { handleToast, handleToastErrors } from "notifications/toast";
import { Link } from "react-router-dom";
import { useAppDispatch } from "state/hooks";

const AllApis = () => {
  const dispatch = useAppDispatch();

  const pingApis = async () => {
    const resultAction = await dispatch(pingAll());
    handleToast(
      resultAction,
      pingAll,
      pingAllApisSuccessMsg,
      pingAllApisErrorMsg
    );
  };

  const handleFetchApis = async () => {
    const resultAction = await dispatch(getAllApis());
    handleToastErrors(resultAction, getAllApis, getAllApisErrorMsg);
  };

  return (
    <>
      <SearchContainer />
      <Link
        to={addApiRoute}
        className="btn btn-api"
        aria-label="Add Api button"
      >
        Add Api
      </Link>
      <button type="button" className="btn btn-ping" onClick={pingApis}>
        Ping All
      </button>
      <button
        type="button"
        className="btn-inverse btn-refresh"
        onClick={handleFetchApis}
      >
        Refresh
      </button>
      <ApisContainer />
    </>
  );
};

export default AllApis;
