import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";

export const pingAllThunk = async (_, thunkAPI) => {
  try {
    const resp = await customFetch.post("/api/ping-all");
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const pingOneThunk = async (_, thunkAPI) => {
  try {
    const resp = await customFetch.post("/api/ping-one");
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
