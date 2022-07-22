import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { pingAllThunk, pingOneThunk } from "./pingThunk";

const initialState = {
  isLoading: false,
  apiId: "",
};

export const pingAll: any = createAsyncThunk("ping/pingAll", pingAllThunk);

export const pingOne: any = createAsyncThunk("ping/pingOne", pingOneThunk);

const pingSlice = createSlice({
  name: "ping",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: {
    [pingAll.pending]: (state) => {
      state.isLoading = true;
      toast.loading("Pinging apis...");
    },
    [pingAll.fulfilled]: (state, { payload }) => {
      toast.dismiss();
      toast.success(payload);
      state.isLoading = false;
    },
    [pingAll.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
    [pingOne.pending]: (state) => {
      state.isLoading = true;
      toast.loading("Pinging api...");
    },
    [pingOne.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.success(payload);
    },
    [pingOne.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
  },
});

export const { showLoading, hideLoading } = pingSlice.actions;

export default pingSlice.reducer;
