import Wrapper from "assets/wrappers/Api";
import ApiInfo from "components/ApiInfo";
import ApiStatus from "components/ApiStatus";
import {
  deleteApiErrorMsg,
  deleteApiSuccessMsg,
  pingOneApiErrorMsg,
  pingOneApiSuccessMsg,
} from "constants/messages";
import { setEditApi } from "features/api/apiSlice";
import { deleteApi } from "features/api/apiThunk";
import { pingOne } from "features/ping/pingThunk";
import moment from "moment";
import { handleToast } from "notifications/toast";
import PropTypes, { InferProps } from "prop-types";
import { BsFillCalendar2PlusFill } from "react-icons/bs";
import { FaCode, FaLayerGroup, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppDispatch } from "state/hooks";

const propTypes = {
  createdAt: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  lastPinged: PropTypes.string.isRequired,
  monitoring: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
};

type ApiProps = InferProps<typeof propTypes>;

// the function params are passed in by the mapped object in ApisContainer.tsx
const Api: React.FC<ApiProps> = ({
  createdAt,
  url,
  host,
  lastPinged,
  monitoring,
  status,
  _id,
}) => {
  const dispatch = useAppDispatch();

  const _createdAt = new Date(createdAt.toString());
  const date = moment(_createdAt).format("MMM Do, YYYY");
  const createdDate = "Created Date: " + date;
  const apiLastPinged = "Last Pinged: " + lastPinged;
  const apiMonitoring = "Monitoring: " + monitoring;

  const handleEdit = async () => {
    dispatch(
      setEditApi({
        apiId: _id,
        url,
        host,
        lastPinged,
        monitoring,
        status,
      })
    );
  };

  const handlePingOne = async () => {
    const resultAction = await dispatch(pingOne(_id));
    handleToast(
      resultAction,
      pingOne,
      pingOneApiSuccessMsg,
      pingOneApiErrorMsg
    );
  };

  const handleDelete = async () => {
    const resultAction = await dispatch(deleteApi(_id));
    handleToast(
      resultAction,
      deleteApi,
      deleteApiSuccessMsg,
      deleteApiErrorMsg
    );
  };

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{host.charAt(0)}</div>
        <div className="info">
          <h4>{host}</h4>
          <p>{url}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <ApiInfo icon={<BsFillCalendar2PlusFill />} text={createdDate} />
          <ApiInfo icon={<FaCode />} text={apiLastPinged} />
          <ApiInfo icon={<FaSearch />} text={apiMonitoring} />
          <ApiStatus
            icon={<FaLayerGroup />}
            text="Status:"
            apiStatus={status}
          />
        </div>
        <footer>
          <div className="actions">
            <button
              type="button"
              className="btn ping-btn"
              onClick={handlePingOne}
            >
              Ping API
            </button>
            <Link to="/edit-api" className="btn edit-btn" onClick={handleEdit}>
              Edit
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

Api.propTypes = propTypes;

export default Api;
