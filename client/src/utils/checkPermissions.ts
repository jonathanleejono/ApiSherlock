import { unauthorizedMsg } from "constants/messages";
import { clearStore } from "features/user/userThunk";

export const checkPermissions = (error: any, thunkAPI: any) => {
  if (error.response.status === 401 || error.response.status === 403) {
    thunkAPI.dispatch(clearStore());
    return thunkAPI.rejectWithValue(unauthorizedMsg);
  }
};
