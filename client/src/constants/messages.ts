const unauthorizedMsg = {
  error: `Session Expired! Logging out...`,
};

const pleaseTryAgainLaterMsg = `please try again later`;

const authUserSuccessMsg = (userFirstName: string) =>
  `Welcome ${userFirstName}!`;

const loginUserErrorMsg = `Login user error, ${pleaseTryAgainLaterMsg}`;
const registerUserErrorMsg = `Register user error, ${pleaseTryAgainLaterMsg}`;

const updateUserSuccessMsg = `Updated profile!`;
const updateUserErrorMsg = `Update user error, ${pleaseTryAgainLaterMsg}`;

const getAllApisErrorMsg = `Error fetching APIs, , ${pleaseTryAgainLaterMsg}`;

const createApiSuccessMsg = `API Added!`;
const createApiErrorMsg = `Error adding API, ${pleaseTryAgainLaterMsg}`;

const editApiSuccessMsg = `API Modified!`;
const editApiErrorMsg = `Error editing API, ${pleaseTryAgainLaterMsg}`;

const deleteApiSuccessMsg = `API Deleted!`;
const deleteApiErrorMsg = `Error deleting API, ${pleaseTryAgainLaterMsg}`;

const pingOneApiSuccessMsg = `Pinged API!`;
const pingOneApiErrorMsg = `Error pinging API, ${pleaseTryAgainLaterMsg}`;

const pingAllApisSuccessMsg = `Pinged APIs!`;
const pingAllApisErrorMsg = `Error pinging API, ${pleaseTryAgainLaterMsg}`;

const pleaseFillOutAllValues = `Please provide all values`;

export {
  unauthorizedMsg,
  authUserSuccessMsg,
  loginUserErrorMsg,
  registerUserErrorMsg,
  updateUserSuccessMsg,
  updateUserErrorMsg,
  getAllApisErrorMsg,
  createApiSuccessMsg,
  createApiErrorMsg,
  editApiSuccessMsg,
  editApiErrorMsg,
  deleteApiSuccessMsg,
  deleteApiErrorMsg,
  pingOneApiSuccessMsg,
  pingOneApiErrorMsg,
  pingAllApisSuccessMsg,
  pingAllApisErrorMsg,
  pleaseFillOutAllValues,
};
