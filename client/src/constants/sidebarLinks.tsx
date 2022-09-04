import {
  addApiRoute,
  allApisRoute,
  monitoringRoute,
  profileRoute,
  statsRoute,
} from "constants/routes";
import { BsStack } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { IoBarChartSharp, IoNewspaper } from "react-icons/io5";

const links = [
  { id: 1, text: "stats", path: statsRoute, icon: <IoBarChartSharp /> },
  { id: 2, text: "all apis", path: allApisRoute, icon: <BsStack /> },
  { id: 3, text: "add api", path: addApiRoute, icon: <IoNewspaper /> },
  { id: 4, text: "monitoring", path: monitoringRoute, icon: <FaSearch /> },
  { id: 5, text: "profile", path: profileRoute, icon: <ImProfile /> },
];

export default links;
