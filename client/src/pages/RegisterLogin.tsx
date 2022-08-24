import Wrapper from "assets/wrappers/RegisterPage";
import { capitalCase } from "change-case";
import { FormRow, Logo } from "components";
import {
  authUserSuccessMsg,
  loginUserErrorMsg,
  pleaseFillOutAllValues,
  registerUserErrorMsg,
} from "constants/messages";
import { setToken } from "constants/token";
import { loginUser, registerUser } from "features/user/userThunk";
import { handleToast } from "notifications/toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { RootState } from "state/store";

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [values, setValues] = useState(initialState);
  const { userAuthenticated, isLoading } = useAppSelector(
    (store: RootState) => store.user
  );
  const { name, email, password, isMember } = values;
  const currentUser = { name, email, password };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    if (!email || !password || (!isMember && !name)) {
      toast.error(pleaseFillOutAllValues);
      return;
    }
    if (isMember) {
      handleLoginUser();
    } else {
      handleRegisterUser();
    }
  };

  const handleLoginUser = async () => {
    const resultAction = await dispatch(loginUser({ email, password }));

    let userFirstName = "";

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
      const { accessToken } = resp.payload;
      setToken(accessToken);
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
      const { accessToken } = resp.payload;
      setToken(accessToken);
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
            value={values.name}
            handleChange={handleChange}
          />
        )}
        {/* email input */}
        <FormRow
          labelText="Email"
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/* password input */}
        <FormRow
          labelText="Password"
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />
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
