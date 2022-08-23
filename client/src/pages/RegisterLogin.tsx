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
import {
  addUserToLocalStorage,
  removeUserFromLocalStorage,
} from "utils/localStorage";

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
  const { user, isLoading } = useAppSelector((store: RootState) => store.user);
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
      const { user, token } = resp.payload;
      console.log("redux user: ", user);
      console.log("redux token: ", token);
      setToken(token);
      addUserToLocalStorage({ user, token });
    } else if (resp.data === "error") {
      removeUserFromLocalStorage();
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
      const { user, token } = resp.payload;
      console.log("redux user: ", user);
      console.log("redux token: ", token);
      addUserToLocalStorage({ user, token });
      // get the token from payload, and then save that to redux
      // with dispatch(setToken(access_token))
    } else if (resp.data === "error") {
      removeUserFromLocalStorage();
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

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
