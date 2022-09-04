const allApisSliceName = `allApis`;
const apiSliceName = `api`;
const userSliceName = `user`;
const pingSliceName = `ping`;
const monitorSliceName = `monitor`;

const getAllApisActionType = `/getApis`;
const getAllApisStatsActionType = `/showStats`;
const createApiActionType = `/createApi`;
const deleteApiActionType = `/deleteApi`;
const updateApiActionType = `/updateApi`;

const registerUserActionType = `/registerUser`;
const loginUserActionType = `/loginUser`;
const updateUserActionType = `/updateUser`;
const clearStoreActionType = `/clearStore`;

const pingOneActionType = `/pingOne`;
const pingAllActionType = `/pingAll`;

const createMonitorActionType = `/create`;
const getMonitorActionType = `/get`;
const updateMonitorActionType = `/update`;
const deleteMonitorActionType = `/delete`;
const startQueueActionType = `/start`;
const removeQueueActionType = `/remove`;

// remember these are action types and not api urls

export {
  allApisSliceName,
  apiSliceName,
  userSliceName,
  pingSliceName,
  monitorSliceName,
  getAllApisActionType,
  getAllApisStatsActionType,
  createApiActionType,
  deleteApiActionType,
  updateApiActionType,
  registerUserActionType,
  loginUserActionType,
  updateUserActionType,
  clearStoreActionType,
  pingOneActionType,
  pingAllActionType,
  createMonitorActionType,
  getMonitorActionType,
  updateMonitorActionType,
  deleteMonitorActionType,
  startQueueActionType,
  removeQueueActionType,
};
