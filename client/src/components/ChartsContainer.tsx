import { useAppSelector } from "state/hooks";
import Wrapper from "assets/wrappers/ChartsContainer";
import BarChart from "components/BarChart";

const ChartsContainer: React.FC = () => {
  const { monthlyApis: data } = useAppSelector((store) => store.allApis);

  return (
    <Wrapper>
      <h4>Monthly Apis</h4>
      <BarChart data={data} />
    </Wrapper>
  );
};

export default ChartsContainer;
