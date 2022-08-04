import Wrapper from "assets/wrappers/ApisContainer";
import Api from "components/Api";
import Loading from "components/Loading";
import PageBtnContainer from "components/PageBtnContainer";
import { getAllApis } from "features/allApis/allApisThunk";
import { ApiDataResponse } from "interfaces/apis";
import { handleToastErrors } from "notifications/toast";
import { useEffect } from "react";
import { getAllApisErrorMsg } from "constants/messages";
import { useAppDispatch, useAppSelector } from "state/hooks";

const ApisContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, allApis, totalApis, numOfPages } = useAppSelector(
    (store) => store.allApis
  );

  const handleFetchApis = async () => {
    const resultAction = await dispatch(getAllApis());
    handleToastErrors(resultAction, getAllApis, getAllApisErrorMsg);
  };

  useEffect(() => {
    handleFetchApis();
  }, []);

  if (isLoading) {
    return <Loading center />;
  }

  if (allApis.length === 0) {
    return (
      <Wrapper>
        <h2>No apis to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h5>
        {totalApis} api{allApis.length > 1 && "s"} found
      </h5>
      <div className="apis">
        {allApis.map((api: ApiDataResponse) => (
          <Api key={api._id} {...api} />
        ))}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default ApisContainer;
