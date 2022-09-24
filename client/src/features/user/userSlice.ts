import { createSlice } from "@reduxjs/toolkit";
import { userSliceName } from "constants/actionTypes";
import {
  getUser,
  loginUser,
  registerUser,
  updateUser,
} from "features/user/userThunk";
import { UserDataResponse } from "interfaces/users";
import { getUserFromLocalStorage } from "utils/localStorage";

interface UsersState {
  isLoading: boolean;
  isSidebarOpen: boolean;
  user: UserDataResponse;
  userAuthenticated: boolean;
}

const initialState: UsersState = {
  isLoading: false,
  isSidebarOpen: false,
  user: { name: "", email: "", timezoneGMT: 0 },
  userAuthenticated: getUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: `${userSliceName}`,
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    resetUserState: () => ({
      ...initialState,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const { user } = payload;
        state.user = user;
        state.userAuthenticated = true;
      }),
      builder.addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.userAuthenticated = false;
      });
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const { user } = payload;
        state.user = user;
        state.userAuthenticated = true;
      }),
      builder.addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.userAuthenticated = false;
      });
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(updateUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const { user } = payload;
        state.user = user;
        state.userAuthenticated = true;
      }),
      builder.addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
        state.userAuthenticated = false;
      });
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(getUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const { name, email, timezoneGMT } = payload;
        state.user = { name, email, timezoneGMT };
        state.userAuthenticated = true;
      }),
      builder.addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.userAuthenticated = false;
      });
  },
});

export const { toggleSidebar, resetUserState } = userSlice.actions;
export default userSlice.reducer;
