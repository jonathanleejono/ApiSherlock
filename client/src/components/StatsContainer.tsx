import { useAppContext } from "../context/appContext";
import StatItem from "./StatItem";
import { FaEnvelopeOpenText, FaBug, FaExclamationCircle } from "react-icons/fa";
import Wrapper from "../assets/wrappers/StatsContainer";
import React from "react";

const StatsContainer = () => {
  const { statsStatus, statsType, statsPriority } = useAppContext();

  const defaultStats = [
    {
      title: "Open Tickets",
      count: statsStatus.Open || 0,
      icon: <FaEnvelopeOpenText />,
      color: "#E8A811", //yellow
      bcg: "#fcefc7", //light yellow
    },
    {
      title: "High Priority Tickets",
      count: statsPriority.High || 0,
      icon: <FaExclamationCircle />,
      color: "#d66a6a", //red
      bcg: "#ffeeee",
    },
    {
      title: "Bug Tickets",
      count: statsType.Bug || 0,
      icon: <FaBug />,
      color: "#647acb", //blue
      bcg: "#e0e8f9",
    },
  ];

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />;
      })}
    </Wrapper>
  );
};

export default StatsContainer;
