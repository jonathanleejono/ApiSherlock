import { faker } from "@faker-js/faker";
import axios from "axios";
import { constructDateTime, getDateWithUTCOffset } from "utils/datetime";
import { testAllApisKey } from "constants/keys";
import {
  pingAllApisSuccessMsg,
  pingOneApiSuccessMsg,
} from "constants/messages";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "test/errors";
import {
  AllApisResponse,
  AllApisStatsResponse,
  ApiDataResponse,
  ApiDefaultStats,
  ApiRequestData,
  MonthlyApis,
  QueryParams,
} from "interfaces/apis";
import { PingResponse } from "interfaces/ping";
import { mockApis } from "test/data/mockApis";
import { getUser } from "test/data/usersDb";
import { ApiSortOptions, ApiStatusOptions } from "enum/apis";

type ApiOptions = {
  [key: string]: ApiDataResponse;
};

let allApisInMemory: ApiOptions = {};

// set key "testAllApisKey", set value to allApis = {}
const persist = () =>
  window.localStorage.setItem(testAllApisKey, JSON.stringify(allApisInMemory));

// get by key "testAllApisKey", set allApis = {} to new allApis value
const load = () => {
  const getAllApisKey = window.localStorage.getItem(testAllApisKey);
  const _allApisKey: string = getAllApisKey !== null ? getAllApisKey : "";
  Object.assign(allApisInMemory, JSON.parse(_allApisKey));
};

const { NODE_ENV, REACT_APP_MSW_DEV } = process.env;

// initialize
if (NODE_ENV === "test" || REACT_APP_MSW_DEV === "on") {
  try {
    load();
  } catch (error) {
    persist();
  }
}

// AUTHORIZE/CHECK PERMISSIONS
async function authorize(userId: string, apiId: string) {
  const api: ApiDataResponse = await getApiById(apiId);
  if (api.createdBy !== userId) {
    const error = new UnAuthenticatedError("Unauthorized action");
    throw error;
  }
}

// CREATE/POST ONE
async function createApi({
  _id,
  createdBy,
  url,
  host,
  status,
  lastPinged,
  monitoring,
  __v,
  createdAt,
  updatedAt,
}: ApiDataResponse): Promise<ApiDataResponse> {
  if (!url || !host || !monitoring) {
    const error = new BadRequestError(`Please fill out all API values`);
    throw error;
  }

  const apiId = _id ? _id : faker.datatype.uuid();

  if (allApisInMemory[apiId]) {
    const error = new BadRequestError(
      `Unique ID error, this API can not be created, please try again`
    );
    throw error;
  }

  allApisInMemory[_id] = {
    _id: apiId,
    createdBy: createdBy ? createdBy : faker.datatype.uuid(),
    url,
    host,
    monitoring,
    status: status ? status : ApiStatusOptions.Pending,
    lastPinged: lastPinged ? lastPinged : "Never pinged",
    __v: __v ? __v : 0,
    createdAt: createdAt ? createdAt : constructDateTime(),
    updatedAt: updatedAt ? updatedAt : constructDateTime(),
  };

  persist();
  return getApiById(_id);
}

// UPDATE/PATCH ONE
async function updateApi(
  _id: string,
  updates: ApiRequestData
): Promise<ApiDataResponse> {
  validateItemExists(_id);
  Object.assign(allApisInMemory[_id], updates);
  persist();
  return getApiById(_id);
}

// DELETE
async function deleteApi(_id: string) {
  validateItemExists(_id);
  delete allApisInMemory[_id];
  persist();
}

// GET ONE
async function getApiById(_id: string): Promise<ApiDataResponse> {
  validateItemExists(_id);
  return allApisInMemory[_id];
}

// VALIDATE ONE EXISTS
function validateItemExists(_id: string) {
  load();
  if (!allApisInMemory[_id]) {
    const error = new NotFoundError(`No API with the id "${_id}"`);
    throw error;
  }
}

const apis = [...mockApis];

// GET ALL MOCK APIS
async function generateMockApis(userId: string): Promise<ApiDataResponse[]> {
  Object.keys(apis).forEach((_, index: number) => {
    const mockApi = apis[index];
    // the mockApi's id is the key
    // to access the mockApi itself in allApisInMemory
    allApisInMemory[mockApi._id] = {
      _id: mockApi._id,
      createdBy: userId,
      url: mockApi.url,
      host: mockApi.host,
      status: mockApi.status,
      lastPinged: mockApi.lastPinged,
      monitoring: mockApi.monitoring,
      createdAt: mockApi.createdAt,
      updatedAt: mockApi.updatedAt,
      __v: mockApi.__v,
    };

    persist();
  });

  return apis;
}

// GET ALL BY OWNER - WITH AUTH
async function getAllApis(
  userId: string,
  queryObject: QueryParams
): Promise<AllApisResponse> {
  // generate mocks in test,
  // but don't reset mock apis in dev
  if (NODE_ENV === "test") {
    await generateMockApis(userId);
  } else if (!allApisInMemory) {
    await generateMockApis(userId);
  }

  const { status, monitoring, search, sort } = queryObject;

  const apisByUser = Object.values(allApisInMemory).filter(
    (api) => api.createdBy === userId
  );

  const _allApis: ApiDataResponse[] = apisByUser.filter((api) => {
    if (status && status !== "All" && api.status !== status) {
      return false;
    }
    if (monitoring && monitoring !== "All" && api.monitoring !== monitoring) {
      return false;
    }

    if (search && !api.url.match(new RegExp(search, "i"))) {
      return false;
    }

    return true;
  });

  function sorting(
    arr: any[],
    apiAttr: string,
    queryParam: string,
    sortByValue: string,
    asc: boolean
  ) {
    if (queryParam && queryParam == sortByValue) {
      if (asc) {
        arr.sort((a, b) => {
          if (a[apiAttr] < b[apiAttr]) return -1;
          if (a[apiAttr] > b[apiAttr]) return 1;
          return 0;
        });
      } else {
        arr.sort((a, b) => {
          if (a[apiAttr] > b[apiAttr]) return -1;
          if (a[apiAttr] < b[apiAttr]) return 1;
          return 0;
        });
      }
    }
  }

  _allApis.sort((a, b) => {
    if (a._id < b._id) return -1;
    if (a._id > b._id) return 1;
    return 0;
  });

  sorting(_allApis, "createdAt", sort, ApiSortOptions.Latest, true);
  sorting(_allApis, "createdAt", sort, ApiSortOptions.Oldest, false);
  sorting(_allApis, "url", sort, ApiSortOptions.A_Z, true);
  sorting(_allApis, "url", sort, ApiSortOptions.Z_A, false);

  const totalApis = _allApis.length;
  const numOfPages = Math.ceil(totalApis / 10);
  return { allApis: _allApis, totalApis, numOfPages };
}

export let pendingApiStats = 0;

// GET allApis Stats
async function getAllApisStats(userId: string): Promise<AllApisStatsResponse> {
  const user = await getUser();

  //generate mock apis first, so data is displayed in stats
  await generateMockApis(userId);

  const mockApisByUser = Object.values(allApisInMemory).filter(
    (api) => api.createdBy === userId
  );

  const defaultStats: ApiDefaultStats = {
    healthy: 0,
    unhealthy: 0,
    pending: 0,
  };

  const monthlyApis: MonthlyApis[] = [{ date: "", count: 0 }];

  Object.keys(mockApisByUser).forEach((_: string, index: number) => {
    const apiStatus = mockApisByUser[index].status;
    defaultStats[apiStatus] += 1;
  });

  monthlyApis[0].date = getDateWithUTCOffset(user.timezoneGMT, false);
  monthlyApis[0].count = mockApisByUser.length;

  pendingApiStats = defaultStats.pending;

  return { defaultStats, monthlyApis };
}

// Ping All Apis
async function pingAllApis(userId: string): Promise<PingResponse> {
  const _allApis = Object.values(allApisInMemory).filter(
    (api) => api.createdBy === userId
  );

  Object.keys(_allApis).forEach(async (_: string, index: number) => {
    try {
      const resp = await axios.get(_allApis[index].url);

      if (resp && resp.status === 200) {
        _allApis[index].status = ApiStatusOptions.Healthy;
        _allApis[index].lastPinged = constructDateTime();
      } else if (!resp) {
        _allApis[index].status = ApiStatusOptions.Unhealthy;
        _allApis[index].lastPinged = constructDateTime();
      }
    } catch (error) {
      return error;
    }
  });
  return { msg: pingAllApisSuccessMsg };
}

// Ping One Api
async function pingOneApi(apiId: string): Promise<PingResponse> {
  try {
    const api = await getApiById(apiId);
    const resp = await axios.get(api.url);

    if (resp && resp.status === 200) {
      api.status = ApiStatusOptions.Healthy;
      api.lastPinged = constructDateTime();
    } else {
      api.status = ApiStatusOptions.Unhealthy;
      api.lastPinged = constructDateTime();
    }
  } catch (error) {
    return error;
  }
  return { msg: pingOneApiSuccessMsg };
}

async function resetDB() {
  allApisInMemory = {};
  persist();
}

export {
  authorize,
  createApi,
  getApiById,
  updateApi,
  deleteApi,
  getAllApis,
  generateMockApis,
  getAllApisStats,
  pingAllApis,
  pingOneApi,
  resetDB,
};
