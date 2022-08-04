import Wrapper from "assets/wrappers/DashboardFormPage";
import { FormRow, FormRowSelect } from "components";
import {
  createApiErrorMsg,
  createApiSuccessMsg,
  pleaseFillOutAllValues,
} from "constants/messages";
import { allApisRoute } from "constants/routes";
import { clearValues, handleChange } from "features/api/apiSlice";
import { createApi } from "features/api/apiThunk";
import { handleToast } from "notifications/toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "state/hooks";

const AddApi = () => {
  useEffect(() => {
    dispatch(clearValues());
  }, []);

  const { isLoading, monitoring, monitoringOptions, url, host, hostOptions } =
    useAppSelector((store) => store.api);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();

    if (!url || !host || !monitoring) {
      toast.error(pleaseFillOutAllValues);
      return;
    }

    const resultAction = await dispatch(createApi({ url, host, monitoring }));
    const resp = handleToast(
      resultAction,
      createApi,
      createApiSuccessMsg,
      createApiErrorMsg
    );

    if (resp.data === "success") {
      navigate(allApisRoute);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
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
