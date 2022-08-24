const baseAuthUrl = `/api/auth`;
const baseApiUrl = `/api/api`;
const baseSeedDbUrl = `/api/mockDb`;

const registerUserUrl = `/register`;
const loginUserUrl = `/login`;
const updateUserUrl = `/updateUser`;
const refreshAccessTokenUrl = `/refreshToken`;

const createApiUrl = ``;
const getAllApisUrl = ``;
const getAllApisStatsUrl = `/stats`;
const deleteApiUrl = ``;
const editApiUrl = ``;
const getApiUrl = ``;
const pingAllApisUrl = `/pingAll`;
const pingOneApiUrl = `/pingOne`;

const resetDb = "/resetDb";
const seedDb = "/seedDb";

const resetMockUsersDbUrl = `${resetDb}/users`;
const resetMockApisDbUrl = `${resetDb}/api`;
const seedMockUsersDbUrl = `${seedDb}/users`;
const seedMockApisDbUrl = `${seedDb}/api`;

const pingHealthCheckUrl = `/api/ping`;

export {
  baseAuthUrl,
  baseApiUrl,
  baseSeedDbUrl,
  resetMockUsersDbUrl,
  seedMockUsersDbUrl,
  resetMockApisDbUrl,
  seedMockApisDbUrl,
  registerUserUrl,
  loginUserUrl,
  updateUserUrl,
  createApiUrl,
  getAllApisUrl,
  getAllApisStatsUrl,
  deleteApiUrl,
  editApiUrl,
  getApiUrl,
  pingAllApisUrl,
  pingOneApiUrl,
  pingHealthCheckUrl,
  refreshAccessTokenUrl,
};
