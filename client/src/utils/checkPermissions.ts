import { unauthorizedMsg } from "constants/messages";
import { clearStore } from "features/user/userThunk";
import { removeUserFromLocalStorage } from "utils/localStorage";

//eslint-disable-next-line
export const checkPermissions = (error: any, thunkAPI: any) => {
  const errorCode = error.response.status;
  if (
    errorCode === 401 ||
    errorCode === 403 ||
    errorCode === 429 ||
    errorCode === 500
  ) {
    removeUserFromLocalStorage();
    thunkAPI.dispatch(clearStore());
    return thunkAPI.rejectWithValue(unauthorizedMsg);
  }
};
