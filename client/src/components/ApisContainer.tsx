import { useEffect } from "react";
import { getAllApis } from "src/features/allApis/allApisSlice";
import { useAppDispatch, useAppSelector } from "src/hooks";
import Wrapper from "../assets/wrappers/ApisContainer";
import Api from "./Api";
import Loading from "./Loading";
import PageBtnContainer from "./PageBtnContainer";

const ApisContainer = () => {
  const dispatch = useAppDispatch();
  const { isLoading, allApis, totalApis, numOfPages } = useAppSelector(
    (store) => store.allApis
  );

  useEffect(() => {
    dispatch(getAllApis());
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
        {allApis.map((api: any) => (
          <Api key={api._id} {...api} />
        ))}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default ApisContainer;
