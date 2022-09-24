import { ChartsContainer, Loading, StatsContainer } from "components";
import { getAllApisErrorMsg } from "constants/messages";
import { getAllApisStats } from "features/allApis/allApisThunk";
import { handleToastErrors } from "notifications/toast";
import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";

const Stats: React.FC = () => {
  const dispatch = useAppDispatch();

  const { isLoading, monthlyApis } = useAppSelector((store) => store.allApis);

  const handleFetchApisStats = useCallback(async () => {
    const resultAction = await dispatch(getAllApisStats());
    handleToastErrors(resultAction, getAllApisStats, getAllApisErrorMsg);
  }, [dispatch]);

  useEffect(() => {
    handleFetchApisStats();
  }, [handleFetchApisStats]);

  if (isLoading) {
    return <Loading center />;
  }
  return (
    <>
      <StatsContainer />
      {monthlyApis.length > 0 && monthlyApis[0].count > 0 ? (
        <ChartsContainer />
      ) : null}
    </>
  );
};

export default Stats;
