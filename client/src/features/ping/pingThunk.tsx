import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  pingAllActionType,
  pingOneActionType,
  pingSliceName,
} from "constants/actionTypes";
import { pingAllApisUrl, pingOneApiUrl } from "constants/urls";
import { getAllApis } from "features/allApis/allApisThunk";
import { ValidationErrors } from "interfaces/errors";
import { PingResponse } from "interfaces/ping";
import { AppDispatch } from "state/store";
import customFetch from "utils/axios";
import { checkPermissions } from "utils/checkPermissions";

const pingAll = createAsyncThunk<
  PingResponse,
  void,
  {
    rejectValue: Partial<ValidationErrors>;
    dispatch: AppDispatch;
  }
>(`${pingSliceName}${pingAllActionType}`, async (_, thunkAPI) => {
  try {
    const resp = await customFetch.post(`${pingAllApisUrl}`);
    thunkAPI.dispatch(getAllApis());
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const pingOne = createAsyncThunk<
  PingResponse,
  string,
  {
    rejectValue: Partial<ValidationErrors>;
    dispatch: AppDispatch;
  }
>(`${pingSliceName}${pingOneActionType}`, async (_id, thunkAPI) => {
  try {
    const resp = await customFetch.post(`${pingOneApiUrl}/${_id}`);
    thunkAPI.dispatch(getAllApis());
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export { pingAll, pingOne };
