import { apiApiUrl } from "constants/urls";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";

export const getAllApisThunk = async (_, thunkAPI) => {
  const { page, search, sort, status, monitoring } =
    thunkAPI.getState().allApis;

  // do not push query params on to separate lines or the query param functionality won't work properly
  // the double /api with the .env is intentional
  // also make sure to not include forward slash in front of apiApiUrl
  let url = `${apiApiUrl}?sort=${sort}&status=${status}&monitoring=${monitoring}&page=${page}`;

  if (search) {
    url += `&search=${search}`;
  }

  try {
    const resp = await customFetch.get(url);

    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const getApiStatsThunk = async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/${apiApiUrl}/stats`);

    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
