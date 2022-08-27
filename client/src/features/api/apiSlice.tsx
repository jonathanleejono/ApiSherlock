import { createSlice } from "@reduxjs/toolkit";
import { apiSliceName } from "constants/actionTypes";
import { ApiHostOptions, ApiMonitoringOptions } from "enum/apis";
import { createApi, deleteApi, editApi } from "features/api/apiThunk";

interface ApiState {
  isLoading: boolean;
  apiId: string;
  url: string;
  host: string;
  monitoring: string;
}

const initialState: ApiState = {
  isLoading: false,
  apiId: "",
  url: "",
  host: ApiHostOptions.AWS, // AWS is default because it's the first option
  monitoring: ApiMonitoringOptions.ON,
};

type ApiOptions = {
  [key: string]: Partial<ApiState>;
};

const apiSlice = createSlice({
  name: `${apiSliceName}`,
  initialState,
  reducers: {
    handleApiInput: (state: ApiOptions, { payload: { name, value } }) => {
      state[name] = value;
    },
    resetApiState: () => ({
      ...initialState,
    }),
    setEditApi: (state, { payload }) => ({ ...state, ...payload }),
  },
  extraReducers: (builder) => {
    builder.addCase(createApi.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(createApi.fulfilled, (state) => {
        state.isLoading = false;
      }),
      builder.addCase(createApi.rejected, (state) => {
        state.isLoading = false;
      });
    builder.addCase(deleteApi.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(deleteApi.fulfilled, (state) => {
        state.isLoading = false;
      }),
      builder.addCase(deleteApi.rejected, (state) => {
        state.isLoading = false;
      });
    builder.addCase(editApi.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(editApi.fulfilled, (state) => {
        state.isLoading = false;
      }),
      builder.addCase(editApi.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetApiState, setEditApi, handleApiInput } = apiSlice.actions;

export default apiSlice.reducer;
