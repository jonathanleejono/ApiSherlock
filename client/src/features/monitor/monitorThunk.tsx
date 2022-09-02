import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createMonitorActionType,
  deleteMonitorActionType,
  getMonitorActionType,
  monitorSliceName,
  removeQueueActionType,
  startQueueActionType,
  updateApiActionType,
} from "constants/actionTypes";
import { handleMonitorUrl, handleQueueUrl } from "constants/apiUrls";
import { ValidationErrors } from "interfaces/errors";
import { MonitorDataResponse, MonitorRequestData } from "interfaces/monitor";
import customFetch from "utils/axios";
import { checkPermissions } from "utils/checkPermissions";

const createMonitor = createAsyncThunk<
  MonitorDataResponse,
  MonitorRequestData,
  {
    rejectValue: Partial<ValidationErrors> & { error: string };
  }
>(
  `${monitorSliceName}${createMonitorActionType}`,
  async (newMonitor, thunkAPI) => {
    try {
      const resp = await customFetch.post(`${handleMonitorUrl}`, newMonitor);
      return resp.data;
    } catch (error) {
      checkPermissions(error, thunkAPI);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const getMonitor = createAsyncThunk<
  MonitorDataResponse,
  void,
  {
    rejectValue: Partial<ValidationErrors>;
  }
>(`${monitorSliceName}${getMonitorActionType}`, async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get(`${handleMonitorUrl}`);
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const editMonitor = createAsyncThunk<
  MonitorDataResponse,
  Partial<MonitorRequestData>,
  {
    rejectValue: Partial<ValidationErrors>;
  }
>(
  `${monitorSliceName}${updateApiActionType}`,
  async (monitorUpdates, thunkAPI) => {
    try {
      const resp = await customFetch.patch(
        `${handleMonitorUrl}`,
        monitorUpdates
      );
      return resp.data;
    } catch (error) {
      checkPermissions(error, thunkAPI);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const deleteMonitor = createAsyncThunk<
  MonitorDataResponse,
  void,
  {
    rejectValue: Partial<ValidationErrors>;
  }
>(`${monitorSliceName}${deleteMonitorActionType}`, async (_, thunkAPI) => {
  try {
    const resp = await customFetch.delete(`${handleMonitorUrl}`);
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const startQueue = createAsyncThunk<
  string,
  void,
  {
    rejectValue: Partial<ValidationErrors>;
  }
>(`${monitorSliceName}${startQueueActionType}`, async (_, thunkAPI) => {
  try {
    const resp = await customFetch.post(`${handleQueueUrl}`);
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const removeQueue = createAsyncThunk<
  string,
  void,
  {
    rejectValue: Partial<ValidationErrors>;
  }
>(`${monitorSliceName}${removeQueueActionType}`, async (_, thunkAPI) => {
  try {
    const resp = await customFetch.delete(`${handleQueueUrl}`);
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export {
  createMonitor,
  getMonitor,
  editMonitor,
  deleteMonitor,
  startQueue,
  removeQueue,
};
