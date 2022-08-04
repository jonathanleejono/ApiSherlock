import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiSliceName,
  createApiActionType,
  deleteApiActionType,
  editApiActionType,
} from "constants/actionTypes";
import { createApiUrl, deleteApiUrl, editApiUrl } from "constants/urls";
import { hideLoading } from "features/allApis/allApisSlice";
import { getAllApis } from "features/allApis/allApisThunk";
import { clearValues } from "features/api/apiSlice";
import { ApiDataResponse, ApiRequestData } from "interfaces/apis";
import { ValidationErrors } from "interfaces/errors";
import { AppDispatch } from "state/store";
import customFetch from "utils/axios";
import { checkPermissions } from "utils/checkPermissions";

const createApi = createAsyncThunk<
  ApiDataResponse,
  ApiRequestData,
  {
    rejectValue: Partial<ValidationErrors> & { error: string };
  }
>(`${apiSliceName}${createApiActionType}`, async (newApi, thunkAPI) => {
  try {
    const resp = await customFetch.post(`${createApiUrl}`, newApi);
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const deleteApi = createAsyncThunk<
  ApiDataResponse,
  string, // the type for "_id"
  {
    rejectValue: Partial<ValidationErrors>;
    dispatch: AppDispatch;
  }
>(`${apiSliceName}${deleteApiActionType}`, async (_id, thunkAPI) => {
  try {
    const resp = await customFetch.delete(`${deleteApiUrl}/${_id}`);
    thunkAPI.dispatch(getAllApis());
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    thunkAPI.dispatch(hideLoading());
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

interface UpdateApiData {
  _id: string;
  api: ApiRequestData;
}

const editApi = createAsyncThunk<
  ApiDataResponse,
  UpdateApiData,
  {
    rejectValue: Partial<ValidationErrors>;
  }
>(`${apiSliceName}${editApiActionType}`, async ({ _id, api }, thunkAPI) => {
  try {
    const resp = await customFetch.patch(`${editApiUrl}/${_id}`, api);
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export { createApi, deleteApi, editApi };
