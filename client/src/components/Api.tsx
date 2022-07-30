import moment from "moment";
import PropTypes, { InferProps } from "prop-types";
import { BsFillCalendar2PlusFill } from "react-icons/bs";
import { FaSearch, FaLayerGroup, FaCode } from "react-icons/fa";
import { Link } from "react-router-dom";
import { deleteApi, setEditApi } from "features/api/apiSlice";
import { pingOne } from "features/ping/pingSlice";
import { useAppDispatch } from "hooks";
import Wrapper from "../assets/wrappers/Api";
import ApiInfo from "./ApiInfo";
import ApiStatus from "./ApiStatus";

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

  const date = moment(createdAt).format("MMM Do, YYYY");
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
    dispatch(pingOne(_id));
  };

  const handleDelete = async () => {
    dispatch(deleteApi(_id));
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
