const baseAuthUrl = `/api/auth`;
const baseApiUrl = `/api/api`;
const baseMonitorUrl = `/api/monitor`;
const baseQueueUrl = `/api/queue`;
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

const handleMonitorUrl = ``;
const handleQueueUrl = ``;

const resetDb = "/resetDb";
const seedDb = "/seedDb";

const resetMockUsersDbUrl = `${resetDb}/users`;
const resetMockApisDbUrl = `${resetDb}/api`;
const resetMockMonitorDbUrl = `${resetDb}/monitor`;
const seedMockUsersDbUrl = `${seedDb}/users`;
const seedMockApisDbUrl = `${seedDb}/api`;

const pingHealthCheckUrl = `/api/ping`;

export {
  baseAuthUrl,
  baseApiUrl,
  baseMonitorUrl,
  baseQueueUrl,
  baseSeedDbUrl,
  resetMockUsersDbUrl,
  seedMockUsersDbUrl,
  resetMockApisDbUrl,
  seedMockApisDbUrl,
  resetMockMonitorDbUrl,
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
  handleMonitorUrl,
  pingHealthCheckUrl,
  refreshAccessTokenUrl,
  handleQueueUrl,
};
