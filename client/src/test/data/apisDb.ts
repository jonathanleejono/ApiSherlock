import { faker } from "@faker-js/faker";
import axios from "axios";
import {
  pingAllApisSuccessMsg,
  pingOneApiSuccessMsg,
} from "constants/messages";
import { BadRequestError, NotFoundError, UnAuthenticatedError } from "errors";
import {
  AllApisResponse,
  AllApisStatsResponse,
  ApiDataResponse,
  ApiDefaultStats,
  ApiRequestData,
  MonthlyApis,
} from "interfaces/apis";
import { PingResponse } from "interfaces/ping";
import { dateTime } from "test/constants/datetime";
import { allApisKey } from "test/constants/keys";
import { mockApis } from "test/data/mockApis";

type ApiOptions = {
  [key: string]: ApiDataResponse;
};

let allApisInMemory: ApiOptions = {};

// set key "__allApis__", set value to allApis = {}
const persist = () =>
  window.localStorage.setItem(allApisKey, JSON.stringify(allApisInMemory));

// get by key "__allApis__", set allApis = {} to new allApis value
const load = () => {
  const getAllApisKey = window.localStorage.getItem(allApisKey);
  const _allApisKey: string = getAllApisKey !== null ? getAllApisKey : "";
  Object.assign(allApisInMemory, JSON.parse(_allApisKey));
};

// initialize
if (process.env.NODE_ENV === "test") {
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

  const date = new Date().toString();

  allApisInMemory[_id] = {
    _id: apiId,
    createdBy: createdBy ? createdBy : faker.datatype.uuid(),
    url,
    host,
    monitoring,
    status: status ? status : "pending",
    lastPinged: lastPinged ? lastPinged : "Never pinged",
    __v: __v ? __v : 0,
    createdAt: createdAt ? createdAt : date,
    updatedAt: updatedAt ? updatedAt : date,
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
async function getMockApis(userId: string): Promise<AllApisResponse> {
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
      createdAt: dateTime,
      updatedAt: dateTime,
      __v: 0,
    };

    persist();
  });

  const totalApis = apis.length;
  const numOfPages = Math.ceil(totalApis / 10);
  return { allApis: apis, totalApis, numOfPages };
}

// GET ALL BY OWNER - WITH AUTH
async function getAllApis(userId: string): Promise<AllApisResponse> {
  const _allApis = await Promise.all(
    Object.keys(allApisInMemory).map((apiId) => {
      authorize(userId, apiId);
      return getApiById(apiId);
    })
  );
  const totalApis = _allApis.length;
  const numOfPages = Math.ceil(totalApis / 10);
  return { allApis: _allApis, totalApis, numOfPages };
}

export let pendingApiStats = 0;

// GET allApis Stats
async function getAllApisStats(userId: string): Promise<AllApisStatsResponse> {
  await getMockApis(userId); //generate mock apis first

  const mockApisByUser = Object.values(allApisInMemory).filter(
    (api) => api.createdBy === userId
  );

  const defaultStats: ApiDefaultStats = {
    healthy: 0,
    unhealthy: 0,
    pending: 0,
  };

  const monthlyApis: [MonthlyApis] = [{ date: "", count: 0 }];

  Object.keys(mockApisByUser).forEach((_: string, index: number) => {
    const apiStatus = mockApisByUser[index].status;
    defaultStats[apiStatus] += 1;
  });

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
        _allApis[index].status = "healthy";
        _allApis[index].lastPinged = dateTime;
      } else if (!resp) {
        _allApis[index].status = "unhealthy";
        _allApis[index].lastPinged = dateTime;
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
      api.status = "healthy";
      api.lastPinged = dateTime;
    } else {
      api.status = "unhealthy";
      api.lastPinged = dateTime;
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
  getMockApis,
  getAllApisStats,
  pingAllApis,
  pingOneApi,
  resetDB,
};
