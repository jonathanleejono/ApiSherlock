import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  clearStoreActionType,
  getUserActionType,
  loginUserActionType,
  registerUserActionType,
  updateUserActionType,
  userSliceName,
} from "constants/actionTypes";
import { authUserUrl, loginUserUrl, registerUserUrl } from "constants/apiUrls";
import { setToken } from "constants/token";
import { clearAllApisState } from "features/allApis/allApisSlice";
import { resetApiState } from "features/api/apiSlice";
import { resetUserState } from "features/user/userSlice";
import { ValidationErrors } from "interfaces/errors";
import {
  AuthUserResponse,
  LoginUserData,
  RegisterUserData,
  UpdateUserData,
  UserDataResponse,
} from "interfaces/users";
import customFetch from "utils/axios";
import { checkPermissions } from "utils/checkPermissions";
import { removeUserFromLocalStorage } from "utils/localStorage";

const registerUser = createAsyncThunk<
  // Return type of the payload creator
  AuthUserResponse,
  // First argument to the payload creator
  RegisterUserData,
  // Types for ThunkAPI
  {
    rejectValue: Partial<ValidationErrors>;
  }
>(`${userSliceName}${registerUserActionType}`, async (newUser, thunkAPI) => {
  try {
    const resp = await customFetch.post(`${registerUserUrl}`, newUser);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const loginUser = createAsyncThunk<
  AuthUserResponse,
  LoginUserData,
  {
    rejectValue: Partial<ValidationErrors>;
  }
>(`${userSliceName}${loginUserActionType}`, async (loginUser, thunkAPI) => {
  try {
    const resp = await customFetch.post(`${loginUserUrl}`, loginUser);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const updateUser = createAsyncThunk<
  AuthUserResponse,
  UpdateUserData,
  {
    rejectValue: Partial<ValidationErrors> & { error: string };
  }
>(`${userSliceName}${updateUserActionType}`, async (updatingUser, thunkAPI) => {
  try {
    const resp = await customFetch.patch(`${authUserUrl}`, updatingUser);
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const getUser = createAsyncThunk<
  UserDataResponse,
  void,
  {
    rejectValue: Partial<ValidationErrors> & { error: string };
  }
>(`${userSliceName}${getUserActionType}`, async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get(`${authUserUrl}`);
    return resp.data;
  } catch (error) {
    checkPermissions(error, thunkAPI);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const clearStore = createAsyncThunk<
  //eslint-disable-next-line
  Promise<any>,
  void,
  {
    rejectValue: Partial<ValidationErrors>;
  }
>(`${userSliceName}${clearStoreActionType}`, async (_, thunkAPI) => {
  try {
    setToken(null);
    removeUserFromLocalStorage();
    thunkAPI.dispatch(resetUserState());
    thunkAPI.dispatch(clearAllApisState());
    thunkAPI.dispatch(resetApiState());
    return Promise.resolve();
  } catch (error) {
    thunkAPI.rejectWithValue(error.response.data);
    return Promise.reject();
  }
});

export { registerUser, loginUser, updateUser, getUser, clearStore };
