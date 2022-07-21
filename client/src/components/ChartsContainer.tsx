import BarChart from "./BarChart";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/ChartsContainer";
import React from "react";

const ChartsContainer = () => {
  const { monthlyApplications: data } = useAppContext();
  return (
    <Wrapper>
      <h4>Monthly Apis</h4>
      <BarChart data={data} />
    </Wrapper>
  );
};

export default ChartsContainer;
