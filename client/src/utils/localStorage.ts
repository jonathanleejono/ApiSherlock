import { allApisKey, tokenKey, usersKey } from "constants/keys";
import { AuthUserResponse } from "interfaces/users";

const addUserToLocalStorage = ({ user, token }: AuthUserResponse) => {
  localStorage.setItem(usersKey, JSON.stringify(user));
  localStorage.setItem(tokenKey, token);
};

const removeUserFromLocalStorage = () => {
  localStorage.removeItem(usersKey);
  localStorage.removeItem(tokenKey);

  if (process.env.REACT_APP_MSW_DEV === "on") {
    localStorage.removeItem(allApisKey);
    localStorage.removeItem("MSW_COOKIE_STORE");
  }
};

const getUserFromLocalStorage = () => {
  const result = localStorage.getItem(usersKey);
  const user = result ? JSON.parse(result) : null;
  return user;
};

const getTokenFromLocalStorage = () => {
  const result = localStorage.getItem(tokenKey);
  const token = result ? result : null;
  return token;
};

export {
  addUserToLocalStorage,
  removeUserFromLocalStorage,
  getUserFromLocalStorage,
  getTokenFromLocalStorage,
};
