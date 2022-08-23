import { createSlice } from "@reduxjs/toolkit";
import { UserDataResponse } from "interfaces/users";
import {
  // getTokenFromLocalStorage,
  getUserFromLocalStorage,
} from "utils/localStorage";
import { loginUser, registerUser, updateUser } from "features/user/userThunk";
import { userSliceName } from "constants/actionTypes";

interface UsersState {
  isLoading: boolean;
  isSidebarOpen: boolean;
  user: UserDataResponse | null;
  token: string | null;
}

const initialState: UsersState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
  // token: getTokenFromLocalStorage(),
  token: "",
};

export const axiosToken = initialState.token;

const userSlice = createSlice({
  name: `${userSliceName}`,
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isSidebarOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        // set state of access_token here
        const { user, token } = payload;
        state.user = user;
        state.token = token;
      }),
      builder.addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      });
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const { user, token } = payload;
        state.user = user;
        state.token = token;
      }),
      builder.addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      });
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(updateUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const { user, token } = payload;
        state.user = user;
        state.token = token;
      }),
      builder.addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;
