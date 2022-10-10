const baseAuthUrl = `/api/auth`;
const baseApiUrl = `/api/api`;
const baseMonitorUrl = `/api/monitor`;
const baseQueueUrl = `/api/queue`;
const baseSeedDbUrl = `/api/mockDb`;

const registerUserUrl = `/register`;
const loginUserUrl = `/login`;
const authUserUrl = `/user`;

const createApiUrl = `/create`;
const getAllApisUrl = `/list`;
const getAllApisStatsUrl = `/stats`;
const deleteApiUrl = ``;
const editApiUrl = `/edit`;
const getApiUrl = ``;
const pingAllApisUrl = `/ping/all`;
const pingOneApiUrl = `/ping`;

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
  authUserUrl,
  createApiUrl,
  getAllApisUrl,
  getAllApisStatsUrl,
  deleteApiUrl,
  editApiUrl,
  getApiUrl,
  pingAllApisUrl,
  pingOneApiUrl,
  handleMonitorUrl,
  handleQueueUrl,
  pingHealthCheckUrl,
};
