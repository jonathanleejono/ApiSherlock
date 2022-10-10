const baseUrl = process.env.REACT_APP_BASE_URL;
const baseAuthUrl = `/auth`;
const baseApiUrl = `/api`;
const baseMonitorUrl = `/monitor`;
const baseQueueUrl = `/queue`;

const getAllApisUrl = `${baseApiUrl}/list`;
const createApiUrl = `${baseApiUrl}/create`;
const deleteApiUrl = `${baseApiUrl}`; // needs :id
const editApiUrl = `${baseApiUrl}/edit`; // needs :id
const getAllApisStatsUrl = `${baseApiUrl}/stats`;
const pingAllApisUrl = `${baseApiUrl}/ping/all`;
const pingOneApiUrl = `${baseApiUrl}/ping`; // needs :id
const registerUserUrl = `${baseAuthUrl}/register`;
const loginUserUrl = `${baseAuthUrl}/login`;
const authUserUrl = `${baseAuthUrl}/user`;
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
  authUserUrl,
  refreshAccessTokenUrl,
  handleMonitorUrl,
  handleQueueUrl,
};
