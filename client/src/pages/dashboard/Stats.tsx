import React, { useEffect } from "react";
import { showStats } from "src/features/allApis/allApisSlice";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { ChartsContainer, Loading, StatsContainer } from "../../components";

const Stats: React.FC = () => {
  const dispatch = useAppDispatch();

  const { isLoading, monthlyApplications } = useAppSelector(
    (store) => store.allApis
  );

  useEffect(() => {
    dispatch(showStats());
  }, []);

  if (isLoading) {
    return <Loading center />;
  }
  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
};

export default Stats;
