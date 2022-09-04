import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  allApisSliceName,
  getAllApisActionType,
  getAllApisStatsActionType,
} from "constants/actionTypes";
import { getAllApisStatsUrl, getAllApisUrl } from "constants/apiUrls";
import { AllApisResponse, AllApisStatsResponse } from "interfaces/apis";
import { ValidationErrors } from "interfaces/errors";
import { RootState } from "state/store";
import customFetch from "utils/axios";
import { checkPermissions } from "utils/checkPermissions";

const getAllApis = createAsyncThunk<
  AllApisResponse,
  void,
  {
    rejectValue: Partial<ValidationErrors>;
    state: RootState;
  }
>(`${allApisSliceName}${getAllApisActionType}`, async (_, thunkAPI) => {
  try {
    const { page, search, sort, status, monitoring, host } =
      thunkAPI.getState().allApis;

    const resp = await customFetch.get(getAllApisUrl, {
      params: {
        sort,
        status,
        monitoring,
        host,
        page,
        search,
      },
    });
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const getAllApisStats = createAsyncThunk<
  AllApisStatsResponse,
  void,
  {
    rejectValue: Partial<ValidationErrors>;
  }
>(`${allApisSliceName}${getAllApisStatsActionType}`, async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get(`${getAllApisStatsUrl}`);
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export { getAllApis, getAllApisStats };
