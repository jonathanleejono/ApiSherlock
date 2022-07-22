import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearValues,
  createApi,
  handleChange,
} from "src/features/api/apiSlice";
import { useAppDispatch, useAppSelector } from "src/hooks";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { FormRow, FormRowSelect } from "../../components";

const AddApi = () => {
  useEffect(() => {
    dispatch(clearValues());
  }, []);

  const { isLoading, monitoring, monitoringOptions, url, host, hostOptions } =
    useAppSelector((store) => store.api);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  //e = event
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url || !host || !monitoring) {
      toast.error("Please provide all values");
      return;
    }

    dispatch(createApi({ url, host, monitoring }));

    navigate("/all-apis");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    dispatch(handleChange({ name, value }));
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>add API</h3>
        <div className="form-center">
          {/* API Url */}
          <FormRow
            type="text"
            labelText="API Url"
            name="url"
            value={url}
            handleChange={handleInput}
          />
          {/* API Host */}
          <FormRowSelect
            labelText="Host"
            name="host"
            value={host}
            handleChange={handleInput}
            list={hostOptions}
          />
          {/* API Monitoring (ie. auto ping) */}
          <FormRowSelect
            labelText="Monitoring"
            name="monitoring"
            value={monitoring}
            handleChange={handleInput}
            list={monitoringOptions}
          />

          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button
              type="reset"
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                dispatch(clearValues());
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddApi;
