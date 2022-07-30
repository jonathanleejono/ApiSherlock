import { apiApiUrl } from "constants/urls";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { getAllApis, hideLoading, showLoading } from "../allApis/allApisSlice";
import { clearValues } from "./apiSlice";

export const createApiThunk = async ({ url, host, monitoring }, thunkAPI) => {
  try {
    const resp = await customFetch.post(`${apiApiUrl}`, {
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
    const resp = await customFetch.delete(`${apiApiUrl}/${id}`);
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
export const editApiThunk = async ({ id, api }, thunkAPI?) => {
  try {
    const resp = await customFetch.patch(`${apiApiUrl}/${id}`, api);
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
