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

const getUserErrorMsg = `Error fetching user details`;

const refreshTokenErrorMsg = `Error in credentials, please login again`;

const getAllApisErrorMsg = `Error fetching APIs, ${pleaseTryAgainLaterMsg}`;

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

const createMonitorSuccessMsg = `Added monitor!`;
const createMonitorErrorMsg = `Error adding monitor, ${pleaseTryAgainLaterMsg}`;

const getMonitorErrorMsg = `Error getting monitoring settings, ${pleaseTryAgainLaterMsg}`;

const editMonitorSuccessMsg = `Updated monitor!`;
const editMonitorErrorMsg = `Error updating monitor, ${pleaseTryAgainLaterMsg}`;

const deleteMonitorSuccessMsg = `Turned off monitoring!`;
const deleteMonitorErrorMsg = `Error turning off monitor, ${pleaseTryAgainLaterMsg}`;

const startQueueSuccessMsg = `Started monitoring!`;
const startQueueErrorMsg = `Error starting monitoring, ${pleaseTryAgainLaterMsg}`;

const removeQueueSuccessMsg = `Monitoring stopped`;
const removeQueueErrorMsg = `Error stopping monitoring, ${pleaseTryAgainLaterMsg}`;

export {
  unauthorizedMsg,
  authUserSuccessMsg,
  loginUserErrorMsg,
  registerUserErrorMsg,
  updateUserSuccessMsg,
  updateUserErrorMsg,
  getUserErrorMsg,
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
  refreshTokenErrorMsg,
  createMonitorSuccessMsg,
  createMonitorErrorMsg,
  getMonitorErrorMsg,
  editMonitorSuccessMsg,
  editMonitorErrorMsg,
  deleteMonitorSuccessMsg,
  deleteMonitorErrorMsg,
  startQueueSuccessMsg,
  startQueueErrorMsg,
  removeQueueSuccessMsg,
  removeQueueErrorMsg,
};
