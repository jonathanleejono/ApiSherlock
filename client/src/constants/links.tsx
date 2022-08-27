import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import {
  addApiRoute,
  allApisRoute,
  profileRoute,
  statsRoute,
} from "constants/routes";

const links = [
  { id: 1, text: "stats", path: statsRoute, icon: <IoBarChartSharp /> },
  { id: 2, text: "all apis", path: allApisRoute, icon: <MdQueryStats /> },
  { id: 3, text: "add api", path: addApiRoute, icon: <FaWpforms /> },
  { id: 4, text: "profile", path: profileRoute, icon: <ImProfile /> },
];

export default links;
