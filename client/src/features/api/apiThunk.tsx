import { showLoading, hideLoading, getAllApis } from "../AllApis/AllApisSlice";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { clearValues } from "./apiSlice";

export const createApiThunk = async ({ url, host, monitoring }, thunkAPI) => {
  // very important to add slashs at end of path (eg. '/battery-cells/')
  // this is so urls can navigate properly
  try {
    const resp = await customFetch.post("/api/api/", {
      url,
      host,
      monitoring,
    });
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data.error
      )
    );
  }
};
export const deleteApiThunk = async (id, thunkAPI?) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/api/api/${id}`);
    thunkAPI.dispatch(getAllApis());
    return resp.data.msg;
  } catch (err) {
    thunkAPI.dispatch(hideLoading());
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data.error
      )
    );
  }
};
export const editApiThunk = async ({ _id, api }, thunkAPI?) => {
  try {
    const resp = await customFetch.patch(`/api/api/${_id}`, api);
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data.error
      )
    );
  }
};
