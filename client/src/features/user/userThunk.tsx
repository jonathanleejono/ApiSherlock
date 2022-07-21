import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { clearAllApisState } from "../allApis/allApisSlice";
import { clearValues } from "../api/apiSlice";
import { logoutUser } from "./userSlice";
import { addUserToLocalStorage } from "../../utils/localStorage";

export const registerUserThunk = async (url: string, newUser, thunkAPI) => {
  try {
    const resp = await customFetch.post(url, newUser);
    const { user, token } = resp.data;
    addUserToLocalStorage({ user, token });
    return resp.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response.data.detail || err.response.data.error
    );
  }
};

export const loginUserThunk = async (url: string, loginUser, thunkAPI) => {
  try {
    const resp = await customFetch.post(url, loginUser);
    const { user, token } = resp.data;
    addUserToLocalStorage({ user, token });
    return resp.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response.data.detail || err.response.data.error
    );
  }
};

export const updateUserThunk = async (url: string, updatedUser, thunkAPI) => {
  try {
    const resp = await customFetch.patch(url, updatedUser);
    const { user, token } = resp.data;
    addUserToLocalStorage({ user, token });
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data.error
      )
    );
  }
};

export const clearStoreThunk = async (message: string, thunkAPI) => {
  try {
    thunkAPI.dispatch(logoutUser(message));
    thunkAPI.dispatch(clearAllApisState());
    thunkAPI.dispatch(clearValues());
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
};
