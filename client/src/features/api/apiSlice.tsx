import { createSlice } from "@reduxjs/toolkit";
import { apiSliceName } from "constants/actionTypes";
import { createApi, deleteApi, editApi } from "features/api/apiThunk";

interface ApiState {
  isLoading: boolean;
  apiId: string;
  url: string;
  host: string;
  hostOptions: string[];
  monitoring: string;
  monitoringOptions: string[];
}

const initialState: ApiState = {
  isLoading: false,
  apiId: "",
  url: "",
  host: "AWS", // AWS is default because it's the first option
  hostOptions: ["AWS", "GCP", "Azure", "Heroku", "DigitalOcean", "Other"],
  monitoring: "on",
  monitoringOptions: ["on", "off"],
};

type ApiOptions = {
  [key: string]: Partial<ApiState>;
};

const apiSlice = createSlice({
  name: `${apiSliceName}`,
  initialState,
  reducers: {
    handleChange: (state: ApiOptions, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => ({
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

export const { handleChange, clearValues, setEditApi } = apiSlice.actions;

export default apiSlice.reducer;
