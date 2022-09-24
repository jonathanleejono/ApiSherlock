import { testAllApisKey, testUserKey } from "test/data/testKeys";

export const appUserKey = "user";

const addUserToLocalStorage = () => {
  try {
    localStorage.setItem(appUserKey, JSON.stringify(true));
  } catch (error) {
    console.error("Error adding user: ", error);
    return error;
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

const getUserFromLocalStorage = (): boolean => {
  try {
    const result = localStorage.getItem(appUserKey);

    if (result) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error getting user");
    return error;
  }
};

export {
  addUserToLocalStorage,
  removeUserFromLocalStorage,
  getUserFromLocalStorage,
};
