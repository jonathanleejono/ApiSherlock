import { apiApiUrl } from "constants/urls";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { getAllApis } from "../allApis/allApisSlice";

export const pingAllThunk = async (_, thunkAPI) => {
  try {
    const resp = await customFetch.post(`/${apiApiUrl}/ping-all`);
    thunkAPI.dispatch(getAllApis());
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const pingOneThunk = async (id, thunkAPI) => {
  try {
    const resp = await customFetch.post(`/${apiApiUrl}/ping-one/${id}`);
    thunkAPI.dispatch(getAllApis());
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
