import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "features/api/apiSlice";
import userSlice from "features/user/userSlice";
import allApisSlice from "features/allApis/allApisSlice";
import pingSlice from "features/ping/pingSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    api: apiSlice,
    allApis: allApisSlice,
    ping: pingSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
