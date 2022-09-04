import Wrapper from "assets/wrappers/SearchContainer";
import {
  validApiHostOptions,
  validApiMonitoringOptions,
  validApiSortOptions,
  validApiStatusOptions,
} from "constants/options/apis";
import { clearFilters, handleChange } from "features/allApis/allApisSlice";
import { getAllApis } from "features/allApis/allApisThunk";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { FormRow, FormRowSelect } from ".";

const SearchContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  const { isLoading, search, status, sort, monitoring, host } = useAppSelector(
    (store) => store.allApis
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    const { name, value } = event.target;

    //handleChange is used here, because search params
    //are needed in universal state
    dispatch(handleChange({ name, value }));
    dispatch(getAllApis());
  };

  const handleSubmit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    dispatch(clearFilters());
    dispatch(getAllApis());
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>search form</h4>
        <div className="form-center">
          {/* search for url */}
          <FormRow
            type="text"
            labelText="API URL search"
            name="search"
            value={search}
            handleChange={handleSearch}
          />
          {/* search by status */}
          <FormRowSelect
            labelText="status"
            name="status"
            value={status}
            handleChange={handleSearch}
            list={["All", ...validApiStatusOptions]}
          />
          {/* search by monitoring */}
          <FormRowSelect
            labelText="monitoring"
            name="monitoring"
            value={monitoring}
            handleChange={handleSearch}
            list={["All", ...validApiMonitoringOptions]}
          />
          {/* search by host */}
          <FormRowSelect
            labelText="host"
            name="host"
            value={host}
            handleChange={handleSearch}
            list={["All", ...validApiHostOptions]}
          />
          {/* sort */}
          <FormRowSelect
            labelText="sort (by URL)"
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={validApiSortOptions}
          />
          <button
            type="reset"
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
