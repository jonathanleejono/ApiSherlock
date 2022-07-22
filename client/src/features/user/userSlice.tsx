import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getUserFromLocalStorage,
  getTokenFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../utils/localStorage";
import {
  loginUserThunk,
  registerUserThunk,
  updateUserThunk,
  clearStoreThunk,
} from "./userThunk";

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
  token: getTokenFromLocalStorage(),
};

const authApiUrl = "/api/auth";

export const registerUser: any = createAsyncThunk(
  "user/registerUser",
  async (user, thunkAPI) =>
    registerUserThunk(`${authApiUrl}/register`, user, thunkAPI)
);

export const loginUser: any = createAsyncThunk(
  "user/loginUser",
  async (user, thunkAPI) =>
    loginUserThunk(`${authApiUrl}/login`, user, thunkAPI)
);

export const updateUser: any = createAsyncThunk(
  "user/updateUser",
  async (user, thunkAPI) =>
    updateUserThunk(`${authApiUrl}/updateUser`, user, thunkAPI)
);

export const clearStore: any = createAsyncThunk(
  "user/clearStore",
  clearStoreThunk
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state, { payload }) => {
      state.user = null;
      state.token = null;
      state.isSidebarOpen = false;
      removeUserFromLocalStorage();
      if (payload) {
        toast.success(payload);
      }
    },
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      const { user, token } = payload;
      state.isLoading = false;
      state.user = user;
      state.token = token;
      toast.success(`Welcome ${user.name}`);
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      removeUserFromLocalStorage();
      toast.dismiss();
      toast.error(payload);
    },
    [loginUser.pending]: (state) => {
      state.isLoading = true;
      toast.loading("Logging in...");
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      const { user, token } = payload;
      state.isLoading = false;
      state.user = user;
      state.token = token;
      toast.dismiss();
      toast.success(`Hello there ${user.name}, logging in...`);
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      removeUserFromLocalStorage();
      toast.dismiss();
      toast.error(payload);
    },
    [updateUser.pending]: (state) => {
      state.isLoading = true;
    },
    [updateUser.fulfilled]: (state, { payload }) => {
      const { user, token } = payload;
      state.isLoading = false;
      state.user = user;
      state.token = token;
      toast.dismiss();
      toast.success(`Profile Updated!`);
    },
    [updateUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [clearStore.rejected]: () => {
      toast.error("There was an error..");
    },
  },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;
