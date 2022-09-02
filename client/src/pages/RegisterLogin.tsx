import Wrapper from "assets/wrappers/RegisterPage";
import { capitalCase } from "change-case";
import { FormRow, FormRowSelect, Logo } from "components";
import {
  authUserSuccessMsg,
  loginUserErrorMsg,
  pleaseFillOutAllValues,
  registerUserErrorMsg,
} from "constants/messages";
import { timezoneOffsets } from "constants/timezoneOffsets";
import { setToken } from "constants/token";
import { loginUser, registerUser } from "features/user/userThunk";
import { handleToast } from "notifications/toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { RootState } from "state/store";
import { addUserToLocalStorage } from "utils/localStorage";

const initialState = {
  name: "",
  email: "",
  password: "",
  timezoneGMT: 0,
  isMember: true,
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [values, setValues] = useState(initialState);

  const { userAuthenticated, isLoading } = useAppSelector(
    (store: RootState) => store.user
  );

  const { name, email, password, isMember, timezoneGMT } = values;

  const currentUser = { name, email, password, timezoneGMT };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  //converts "timezoneGMT" variable name into string
  const timezoneKey = Object.keys({ timezoneGMT })[0];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    //list of timezones are float numbers,
    //so values need to be parsed to *float* (not int)
    setValues({
      ...values,
      [name]: name === timezoneKey ? parseFloat(value) : value,
    });
  };

  const onSubmit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    if (
      !email ||
      !password ||
      // name isn't needed to login
      (!isMember && !name)
    ) {
      toast.error(pleaseFillOutAllValues);
      return;
    }

    if (isMember) {
      handleLoginUser();
    } else {
      handleRegisterUser();
    }
  };

  //user doesn't login with name,
  //which is why name is initialized here
  let userFirstName = "";

  const handleLoginUser = async () => {
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      userFirstName = resultAction.payload.user.name;
    }

    const resp = handleToast(
      resultAction,
      loginUser,
      authUserSuccessMsg(capitalCase(userFirstName)),
      loginUserErrorMsg
    );

    if (resp.data === "success") {
      const { user, accessToken } = resp.payload;
      setToken(accessToken);
      addUserToLocalStorage(user);
    }
  };

  const handleRegisterUser = async () => {
    const resultAction = await dispatch(registerUser(currentUser));
    const resp = handleToast(
      resultAction,
      registerUser,
      authUserSuccessMsg(capitalCase(name)),
      registerUserErrorMsg
    );

    if (resp.data === "success") {
      const { user, accessToken } = resp.payload;
      setToken(accessToken);
      addUserToLocalStorage(user);
    }
  };

  useEffect(() => {
    if (userAuthenticated) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [userAuthenticated, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />

        <h3>{values.isMember ? "Login" : "Register"}</h3>

        {/* name input */}
        {!values.isMember && (
          <FormRow
            labelText="Name"
            type="text"
            name="name"
            value={name}
            handleChange={handleChange}
          />
        )}
        {/* email input */}
        <FormRow
          labelText="Email"
          type="email"
          name="email"
          value={email}
          handleChange={handleChange}
        />
        {/* password input */}
        <FormRow
          labelText="Password"
          type="password"
          name="password"
          value={password}
          handleChange={handleChange}
        />
        {/* timezone input */}
        {!values.isMember && (
          <FormRowSelect
            labelText="Timezone"
            name="timezoneGMT"
            value={timezoneGMT}
            handleChange={handleChange}
            list={timezoneOffsets}
          />
        )}
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};
export default Register;
