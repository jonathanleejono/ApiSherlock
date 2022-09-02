import { appUserKey, testAllApisKey, testUserKey } from "constants/keys";
import { AuthUser } from "interfaces/users";
import { decryptData, encryptData } from "utils/encrypt";

const addUserToLocalStorage = (user: AuthUser) => {
  try {
    const encryptedUser = encryptData(JSON.stringify(user));
    localStorage.setItem(appUserKey, encryptedUser);
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

const removeUserFromLocalStorage = () => {
  localStorage.removeItem(appUserKey);

  if (process.env.REACT_APP_MSW_DEV === "on") {
    localStorage.removeItem(testAllApisKey);
    localStorage.removeItem(testUserKey);
    localStorage.removeItem("MSW_COOKIE_STORE");
  }
};

const getUserFromLocalStorage = () => {
  try {
    const result = localStorage.getItem(appUserKey);

    const decryptedUser = result
      ? JSON.parse(decryptData(result))
      : { name: "", email: "", timezoneGMT: 0 };

    return decryptedUser;
  } catch (error) {
    console.error("Invalid user");
    return error;
  }
};

export {
  addUserToLocalStorage,
  removeUserFromLocalStorage,
  getUserFromLocalStorage,
};
