import {
  clearFilters,
  getAllApis,
  handleChange,
} from "features/allApis/allApisSlice";
import { useAppDispatch, useAppSelector } from "hooks";
import { FormRow, FormRowSelect } from ".";
import Wrapper from "../assets/wrappers/SearchContainer";

const SearchContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    isLoading,
    search,
    status,
    sort,
    statusOptions,
    sortOptions,
    monitoring,
    monitoringOptions,
  } = useAppSelector((store) => store.allApis);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    const { name, value } = event.target;
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
            list={["All", ...statusOptions]}
          />
          {/* search by monitoring */}
          <FormRowSelect
            labelText="monitoring"
            name="monitoring"
            value={monitoring}
            handleChange={handleSearch}
            list={["All", ...monitoringOptions]}
          />
          {/* sort */}
          <FormRowSelect
            labelText="sort"
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
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
