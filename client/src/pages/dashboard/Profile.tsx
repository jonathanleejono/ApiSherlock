import Wrapper from "assets/wrappers/DashboardFormPage";
import { FormRow, FormRowSelect } from "components";
import {
  getUserErrorMsg,
  pleaseFillOutAllValues,
  updateUserErrorMsg,
  updateUserSuccessMsg,
} from "constants/messages";
import { timezoneOffsets } from "constants/options/timezoneOffsets";
import { setToken } from "constants/token";
import { clearStore, getUser, updateUser } from "features/user/userThunk";
import { handleToast, handleToastErrors } from "notifications/toast";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { addUserToLocalStorage } from "utils/localStorage";

const Profile = () => {
  const dispatch = useAppDispatch();

  const handleFetchUser = useCallback(async () => {
    const resultAction = await dispatch(getUser());

    handleToastErrors(resultAction, getUser, getUserErrorMsg);
  }, [dispatch]);

  useEffect(() => {
    handleFetchUser();
  }, [handleFetchUser]);

  const { user, isLoading } = useAppSelector((store) => store.user);

  const [values, setValues] = useState(user);

  const { name, email, timezoneGMT } = values;

  const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();

    if (!name || !email) {
      toast.error(pleaseFillOutAllValues);
      return;
    }

    const resultAction = await dispatch(
      updateUser({ name, email, timezoneGMT })
    );

    const resp = handleToast(
      resultAction,
      updateUser,
      updateUserSuccessMsg,
      updateUserErrorMsg
    );

    if (resp.data === "success") {
      const { accessToken } = resp.payload;
      setToken(accessToken);
      addUserToLocalStorage();
    } else if (resp.data === "error") {
      dispatch(clearStore());
    }
  };

  //converts "timezoneGMT" variable name into string
  const timezoneKey = Object.keys({ timezoneGMT })[0];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    //list of timezone options are float numbers,
    //so values need to be parsed to *float* (not int)
    setValues({
      ...values,
      [name]: name === timezoneKey ? parseFloat(value) : value,
    });
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>profile</h3>
        <div className="form-center">
          <FormRow
            labelText="Name"
            type="text"
            name="name"
            value={name}
            handleChange={handleChange}
          />
          <FormRow
            labelText="Email"
            type="email"
            name="email"
            value={email}
            handleChange={handleChange}
          />
          <FormRowSelect
            labelText="Timezone"
            name="timezoneGMT"
            value={timezoneGMT}
            handleChange={handleChange}
            list={timezoneOffsets}
          />
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Please Wait..." : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
