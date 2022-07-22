import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createApiThunk, deleteApiThunk, editApiThunk } from "./apiThunk";

const initialState = {
  isLoading: false,
  apiId: "",
  url: "",
  // AWS is default because it's the first option
  host: "AWS",
  hostOptions: ["AWS", "GCP", "Azure", "Heroku", "DigitalOcean", "Other"],
  monitoring: "on",
  monitoringOptions: ["on", "off"],
};

export const createApi: any = createAsyncThunk("api/createApi", createApiThunk);

export const deleteApi: any = createAsyncThunk("api/deleteApi", deleteApiThunk);

export const editApi: any = createAsyncThunk("api/editApi", editApiThunk);

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => ({
      ...initialState,
    }),
    setEditApi: (state, { payload }) => ({ ...state, ...payload }),
  },
  extraReducers: {
    [createApi.pending]: (state) => {
      state.isLoading = true;
      toast.loading("Please wait...");
    },
    [createApi.fulfilled]: (state) => {
      state.isLoading = false;
      toast.dismiss();
      toast.success("Api Added");
    },
    [createApi.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
    [deleteApi.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteApi.fulfilled]: (state) => {
      state.isLoading = false;
      toast.success("Api Deleted");
    },
    [deleteApi.rejected]: (state, { payload }) => {
      toast.error(payload);
    },
    [editApi.pending]: (state) => {
      toast.loading("Please wait...");
      state.isLoading = true;
    },
    [editApi.fulfilled]: (state) => {
      state.isLoading = false;
      toast.dismiss();
      toast.success("Api Modified...");
    },
    [editApi.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
  },
});

export const { handleChange, clearValues, setEditApi } = apiSlice.actions;

export default apiSlice.reducer;
