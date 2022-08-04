import { createSlice } from "@reduxjs/toolkit";
import { pingSliceName } from "constants/actionTypes";
import { pingAll, pingOne } from "features/ping/pingThunk";

interface PingState {
  isLoading: boolean;
  apiId: string;
}

const initialState: PingState = {
  isLoading: false,
  apiId: "",
};

const pingSlice = createSlice({
  name: `${pingSliceName}`,
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(pingAll.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(pingAll.fulfilled, (state) => {
        state.isLoading = false;
      }),
      builder.addCase(pingAll.rejected, (state) => {
        state.isLoading = false;
      });
    builder.addCase(pingOne.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(pingOne.fulfilled, (state) => {
        state.isLoading = false;
      }),
      builder.addCase(pingOne.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { showLoading, hideLoading } = pingSlice.actions;

export default pingSlice.reducer;
