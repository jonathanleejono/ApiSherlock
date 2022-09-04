const baseUrl = process.env.REACT_APP_BASE_URL;
const baseAuthUrl = `/auth`;
const baseApiUrl = `/api`;
const baseMonitorUrl = `/monitor`;
const baseQueueUrl = `/queue`;

const getAllApisUrl = `${baseApiUrl}`;
const createApiUrl = `${baseApiUrl}`;
const deleteApiUrl = `${baseApiUrl}`; // needs :id
const editApiUrl = `${baseApiUrl}`; // needs :id
const getAllApisStatsUrl = `${baseApiUrl}/stats`;
const pingAllApisUrl = `${baseApiUrl}/pingAll`;
const pingOneApiUrl = `${baseApiUrl}/pingOne`; // needs :id
const registerUserUrl = `${baseAuthUrl}/register`;
const loginUserUrl = `${baseAuthUrl}/login`;
const updateUserUrl = `${baseAuthUrl}/updateUser`;
const refreshAccessTokenUrl = `${baseAuthUrl}/refreshToken`;
const handleMonitorUrl = `${baseMonitorUrl}`;
const handleQueueUrl = `${baseQueueUrl}`;

export {
  baseUrl,
  baseAuthUrl,
  baseApiUrl,
  getAllApisUrl,
  getAllApisStatsUrl,
  createApiUrl,
  deleteApiUrl,
  editApiUrl,
  pingAllApisUrl,
  pingOneApiUrl,
  registerUserUrl,
  loginUserUrl,
  updateUserUrl,
  refreshAccessTokenUrl,
  handleMonitorUrl,
  handleQueueUrl,
};
