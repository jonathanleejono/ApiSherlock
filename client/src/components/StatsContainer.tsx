import { FaBug, FaEnvelopeOpenText, FaExclamationCircle } from "react-icons/fa";
import { useAppSelector } from "src/hooks";
import Wrapper from "../assets/wrappers/StatsContainer";
import StatItem from "./StatItem";

const StatsContainer = () => {
  const { defaultStats }: any = useAppSelector((store) => store.allApis);

  const _defaultStats = [
    {
      title: "Healthy Apis",
      count: defaultStats.healthy || 0,
      icon: <FaEnvelopeOpenText />,
      color: "#E8A811", //yellow
      bcgColor: "#fcefc7", //light yellow
    },
    {
      title: "Unhealthy Apis",
      count: defaultStats.unhealthy || 0,
      icon: <FaExclamationCircle />,
      color: "#d66a6a", //red
      bcgColor: "#ffeeee",
    },
    {
      title: "Pending Apis",
      count: defaultStats.pending || 0,
      icon: <FaBug />,
      color: "#647acb", //blue
      bcgColor: "#e0e8f9",
    },
  ];

  return (
    <Wrapper>
      {_defaultStats.map((item, index) => (
        <StatItem key={index} {...item} />
      ))}
    </Wrapper>
  );
};

export default StatsContainer;
