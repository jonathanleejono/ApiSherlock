import { useAppContext } from "../context/appContext";
import StatItem from "./StatItem";
import { FaEnvelopeOpenText, FaBug, FaExclamationCircle } from "react-icons/fa";
import Wrapper from "../assets/wrappers/StatsContainer";
import React from "react";

const StatsContainer = () => {
  const { statsStatus, statsType, statsPriority } = useAppContext();

  const defaultStats = [
    {
      title: "Open Apis",
      count: statsStatus.Open || 0,
      icon: <FaEnvelopeOpenText />,
      color: "#E8A811", //yellow
      bcgColor: "#fcefc7", //light yellow
    },
    {
      title: "High Priority Apis",
      count: statsPriority.High || 0,
      icon: <FaExclamationCircle />,
      color: "#d66a6a", //red
      bcgColor: "#ffeeee",
    },
    {
      title: "Bug Apis",
      count: statsType.Bug || 0,
      icon: <FaBug />,
      color: "#647acb", //blue
      bcgColor: "#e0e8f9",
    },
  ];

  return (
    <Wrapper>
      {defaultStats.map((item, index) => (
        <StatItem key={index} {...item} />
      ))}
    </Wrapper>
  );
};

export default StatsContainer;
