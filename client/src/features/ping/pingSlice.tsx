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
    },
    [pingAll.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [pingAll.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [pingOne.pending]: (state) => {
      state.isLoading = true;
    },
    [pingOne.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [pingOne.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { showLoading, hideLoading } = pingSlice.actions;

export default pingSlice.reducer;
