import Wrapper from "assets/wrappers/DashboardFormPage";
import { FormRow, FormRowSelect } from "components";
import {
  editApiErrorMsg,
  editApiSuccessMsg,
  pleaseFillOutAllValues,
} from "constants/messages";
import { apiHostOptions, apiMonitoringOptions } from "constants/options";
import { allApisRoute } from "constants/routes";
import { handleApiInput, resetApiState } from "features/api/apiSlice";
import { editApi } from "features/api/apiThunk";
import { handleToast } from "notifications/toast";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "state/hooks";

const EditApi = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoading, monitoring, url, host, apiId } = useAppSelector(
    (store) => store.api
  );

  const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();

    if (!url || !host || !monitoring) {
      toast.error(pleaseFillOutAllValues);
      return;
    }

    const resultAction = await dispatch(
      // in Api.tsx, the Redux state apiId is set with the actual api._id
      // through the setEdit dispatch (in handleEdit)
      editApi({ _id: apiId, api: { url, host, monitoring } })
    );

    const resp = handleToast(
      resultAction,
      editApi,
      editApiSuccessMsg,
      editApiErrorMsg
    );

    if (resp.data === "success") {
      navigate(allApisRoute);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(handleApiInput({ name, value }));
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>edit API</h3>
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
            list={apiHostOptions}
          />
          {/* API Monitoring (ie. auto ping) */}
          <FormRowSelect
            labelText="Monitoring"
            name="monitoring"
            value={monitoring}
            handleChange={handleInput}
            list={apiMonitoringOptions}
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
                dispatch(resetApiState());
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

export default EditApi;
