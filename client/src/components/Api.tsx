import moment from "moment";
import { BsFillCalendar2PlusFill, BsPersonCircle } from "react-icons/bs";
import {
  FaBriefcase,
  FaLayerGroup,
  FaRegCreditCard,
  FaUserFriends,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { deleteApi, setEditApi } from "src/features/api/apiSlice";
import { useAppDispatch } from "src/hooks";
import Wrapper from "../assets/wrappers/Api";
import ApiInfo from "./ApiInfo";
import ApiStatus from "./ApiStatus";

interface ApiProps {
  createdAt: string;
  url: string;
  host: string;
  lastPinged: string;
  monitoring: string;
  status: string;
  _id: string;
}

// the function params are from the mapped object in ApisContainer.tsx
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

  // const { isLoading } = useAppSelector((store: any) => store.api);

  const date = moment(createdAt).format("MMM Do, YYYY");
  const createdDate = "Created Date: " + date;
  const apiUrl = "API URL: " + url;
  const apiHost = "Host: " + host;
  const apiLastPinged = "Last Pinged: " + lastPinged;
  const apiMonitoring = "Monitoring: " + monitoring;

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
          <ApiInfo icon={<BsPersonCircle />} text={apiUrl} />
          <ApiInfo icon={<FaUserFriends />} text={apiHost} />
          <ApiInfo icon={<FaRegCreditCard />} text={apiLastPinged} />
          <ApiInfo icon={<FaBriefcase />} text={apiMonitoring} />
          <ApiStatus
            icon={<FaLayerGroup />}
            text="Status:"
            apiStatus={status}
          />
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/edit-api"
              className="btn edit-btn"
              onClick={() =>
                dispatch(
                  setEditApi({ _id, url, host, lastPinged, monitoring, status })
                )
              }
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => dispatch(deleteApi(_id))}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Api;
