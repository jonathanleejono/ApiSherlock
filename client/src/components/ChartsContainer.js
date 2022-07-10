import BarChart from "./BarChart";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/ChartsContainer";

const ChartsContainer = () => {
  const { monthlyApplications: data } = useAppContext();
  return (
    <Wrapper>
      <h4>Monthly Tickets</h4>
      <BarChart data={data} />
    </Wrapper>
  );
};

export default ChartsContainer;
