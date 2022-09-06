import Wrapper from "assets/wrappers/ChartsContainer";
import BarChart from "components/BarChart";
import { useAppSelector } from "state/hooks";

const ChartsContainer: React.FC = () => {
  const { monthlyApis } = useAppSelector((store) => store.allApis);

  return (
    <Wrapper>
      <h4>Monthly Apis</h4>
      <BarChart data={monthlyApis} />
    </Wrapper>
  );
};

export default ChartsContainer;
