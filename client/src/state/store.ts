import { configureStore } from "@reduxjs/toolkit";
import allApisSlice from "features/allApis/allApisSlice";
import apiSlice from "features/api/apiSlice";
import monitorSlice from "features/monitor/monitorSlice";
import pingSlice from "features/ping/pingSlice";
import userSlice from "features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    api: apiSlice,
    allApis: allApisSlice,
    ping: pingSlice,
    monitor: monitorSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
