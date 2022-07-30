import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../../errors";
import { mockApis } from "./mockApis";

const allApisKey = "__allApis__";

let allApis = {};

// set key "__allApis__", set value to allApis = {}
const persist = () =>
  window.localStorage.setItem(allApisKey, JSON.stringify(allApis));

// get by key "__allApis__", set allApis = {} to new allApis value
const load = () => {
  const getAllApisKey = window.localStorage.getItem(allApisKey);
  const _allApisKey: string = getAllApisKey !== null ? getAllApisKey : "";
  Object.assign(allApis, JSON.parse(_allApisKey));
};

// initialize
try {
  load();
} catch (error) {
  persist();
  // ignore json parse error
}

// might need to change all of the "id" to "_id"

// PURGE/DELETE ALL
const purgeListItems = () => {
  Object.keys(allApis).forEach((key) => {
    delete allApis[key];
  });
  persist();
};

// AUTH ONE
async function authorize(userId: string, apiId: string) {
  const api: any = await getApiById(apiId);
  console.log("userId: ", userId);
  console.log("auth api: ", api);
  if (api.createdBy !== userId) {
    const error: UnAuthenticatedError = new UnAuthenticatedError(
      "Unauthorized action"
    );
    error.statusCode = 403;
    throw error;
  }
}

// CREATE/POST ONE
async function createApi({
  _id = required("_id"),
  createdBy = required("createdBy"),
  url = required("url"),
  host = required("host"),
  status = required("status"),
  lastPinged = required("lastPinged"),
  monitoring = required("monitoring"),
}) {
  // const localStorageId = hash(`${createdBy}`);

  if (allApis[_id]) {
    const error: BadRequestError = new BadRequestError(
      `Unique ID error, this API can not be created, please try again`
    );
    error.statusCode = 400;
    throw error;
  }

  allApis[_id] = {
    _id,
    createdBy,
    url,
    host,
    status,
    lastPinged,
    monitoring,
  };

  persist();
  return getApiById(_id);
}

// GET ONE
async function getApiById(_id: string) {
  validateItemExists(_id);
  return allApis[_id];
}

// UPDATE/PATCH ONE
async function updateApi(id: string, updates) {
  console.log("list items update");
  validateItemExists(id);
  Object.assign(allApis[id], updates);
  persist();
  console.log("all apis 7: ", allApis);
  return getApiById(id);
}

// DELETE
async function deleteApi(id: string) {
  validateItemExists(id);
  delete allApis[id];
  persist();
}

// // GET MANY
// async function readMany(userId, listItemIds) {
//   return Promise.all(
//     listItemIds.map((id) => {
//       authorize(userId, id);
//       return getApiById(id);
//     })
//   );
// }

const apis = [...mockApis];

async function getMockApis(userId: string) {
  Object.keys(apis).forEach((api: any) => {
    // const mockApiId = apis[api]._id;
    allApis[apis[api]._id] = {
      _id: apis[api]._id,
      createdBy: userId,
      url: apis[api].url,
      host: apis[api].host,
      status: apis[api].status,
      lastPinged: apis[api].lastPinged,
      monitoring: apis[api].monitoring,
    };

    persist();
  });

  const totalApis = apis.length;
  const numOfPages = Math.ceil(totalApis / 10);
  return { allApis: apis, totalApis, numOfPages };
}

// GET ALL BY OWNER - WITH AUTH
async function getAllApis(userId: string) {
  Object.keys(apis).forEach((api) => {
    apis[api]["createdBy"] = "yo";
  });
  const _allApis = await Promise.all(
    Object.keys(allApis).map((apiId) => {
      authorize(userId, apiId);
      return getApiById(apiId);
    })
  );
  const totalApis = _allApis.length;
  const numOfPages = Math.ceil(totalApis / 10);
  return { _allApis, totalApis, numOfPages };
}

// GET ALL BY OWNER
// async function readByOwner(userId) {
//   return Object.values(allApis).filter((li: any) => li.createdBy === userId);
// }

// VALIDATE ONE EXISTS
function validateItemExists(_id) {
  load();
  console.log("val apis: ", allApis);
  if (!allApis[_id]) {
    const error: NotFoundError = new NotFoundError(
      `No API with the id "${_id}"`
    );
    error.statusCode = 404;
    throw error;
  }
}

function hash(str) {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
}

function required(key: string) {
  const error: BadRequestError = new BadRequestError(`${key} is required`);
  error.statusCode = 400;
  throw error;
}

async function resetDB() {
  allApis = {};
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
  //   readByOwner,
  resetDB,
};
