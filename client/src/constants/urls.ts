const baseUrl = process.env.REACT_APP_BASE_URL;
const authApiUrl = process.env.REACT_APP_AUTH_URL;
const apiApiUrl = process.env.REACT_APP_API_URL;

const getAllApisUrl = `${apiApiUrl}`;
const createApiUrl = `${apiApiUrl}`;
const deleteApiUrl = `${apiApiUrl}`; // needs :id
const editApiUrl = `${apiApiUrl}`; // needs :id
const getAllApisStatsUrl = `${apiApiUrl}/stats`;
const pingAllApisUrl = `${apiApiUrl}/pingAll`;
const pingOneApiUrl = `${apiApiUrl}/pingOne`; // needs :id
const registerUserUrl = `${authApiUrl}/register`;
const loginUserUrl = `${authApiUrl}/login`;
const updateUserUrl = `${authApiUrl}/updateUser`;

export {
  baseUrl,
  authApiUrl,
  apiApiUrl,
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
};
