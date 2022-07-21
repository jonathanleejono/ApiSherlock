import { useAppSelector } from "src/hooks";
import Wrapper from "../assets/wrappers/ChartsContainer";
import BarChart from "./BarChart";

const ChartsContainer = () => {
  const { monthlyApplications: data } = useAppSelector(
    (store) => store.allApis
  );

  return (
    <Wrapper>
      <h4>Monthly Apis</h4>
      <BarChart data={data} />
    </Wrapper>
  );
};

export default ChartsContainer;
