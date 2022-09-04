import { faker } from "@faker-js/faker";
import {
  baseUrl,
  createApiUrl,
  deleteApiUrl,
  editApiUrl,
  getAllApisStatsUrl,
  getAllApisUrl,
  pingAllApisUrl,
  pingOneApiUrl,
} from "constants/apiUrls";
import {
  createApiErrorMsg,
  deleteApiErrorMsg,
  deleteApiSuccessMsg,
  editApiErrorMsg,
  getAllApisErrorMsg,
  pingAllApisErrorMsg,
} from "constants/messages";
import { validApiSearchParams } from "constants/options/apis";
import { ApiStatusOptions } from "enum/apis";
import { ApiDataResponse, ApiQueryParams } from "interfaces/apis";
import { rest } from "msw";
import * as apisDB from "test/data/apisDb";
import * as usersDB from "test/data/usersDb";
import { userHash } from "test/data/usersDb";
import { constructDateTime } from "utils/datetime";

const customClientFetch = (path: string) => `${baseUrl}${path}`.toString();

const handlers = [
  //   GET allApis
  rest.get(customClientFetch(`${getAllApisUrl}`), async (req, res, ctx) => {
    try {
      type QueryParamsOptions = {
        [key: string]: string | number;
      };

      interface CustomQueryParams extends ApiQueryParams, QueryParamsOptions {}

      const queryObject: CustomQueryParams = {
        sort: "",
        page: 1,
        monitoring: "",
        host: "",
        status: "",
        search: "",
      };

      const queryParams = req.url.searchParams;

      Object.keys(validApiSearchParams).forEach((_: string, index: number) => {
        const validQueryParam = validApiSearchParams[index] as string;
        if (queryParams.has(validQueryParam)) {
          queryObject[validQueryParam] = queryParams.get(
            validQueryParam
          ) as string;
        }
      });

      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      const { allApis, totalApis, numOfPages } = await apisDB.getAllApis(
        userId,
        queryObject
      );
      return res(ctx.json({ allApis, totalApis, numOfPages }));
    } catch (err) {
      console.log("Get All Apis Error: ", err);
      return res(ctx.status(400), ctx.json({ error: getAllApisErrorMsg }));
    }
  }),

  //   GET allApis STATS
  rest.get(customClientFetch(getAllApisStatsUrl), async (req, res, ctx) => {
    try {
      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      const { defaultStats, monthlyApis } = await apisDB.getAllApisStats(
        userId
      );
      return res(ctx.json({ defaultStats, monthlyApis }));
    } catch (err) {
      console.log("Get Api Stats Error: ", err);
      return res(ctx.status(400), ctx.json({ error: getAllApisErrorMsg }));
    }
  }),

  // CREATE api
  rest.post(customClientFetch(createApiUrl), async (req, res, ctx) => {
    try {
      const { url, host, monitoring } = await req.json();
      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      const createdApi = await apisDB.createApi({
        _id: faker.datatype.uuid(),
        createdBy: userId,
        url: url,
        host: host,
        status: ApiStatusOptions.PENDING,
        lastPinged: "Never pinged",
        monitoring: monitoring,
        createdAt: constructDateTime(),
        updatedAt: constructDateTime(),
        __v: 0,
      });

      return res(ctx.status(200), ctx.json(createdApi));
    } catch (err) {
      console.log("Create API Error: ", err);
      return res(ctx.status(400), ctx.json({ error: createApiErrorMsg }));
    }
  }),

  // UPDATE api
  rest.patch(customClientFetch(`${editApiUrl}/:id`), async (req, res, ctx) => {
    try {
      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      const { id } = req.params;
      const apiId = id as string;
      await apisDB.authorize(userId, apiId);
      const updates = await req.json();
      const updatedApi: ApiDataResponse = await apisDB.updateApi(
        apiId,
        updates
      );
      return res(ctx.json(updatedApi));
    } catch (err) {
      console.log("Update API Error: ", err);
      return res(ctx.status(400), ctx.json({ error: editApiErrorMsg }));
    }
  }),

  // DELETE api
  rest.delete(
    customClientFetch(`${deleteApiUrl}/:id`),
    async (req, res, ctx) => {
      try {
        const user = await usersDB.authenticateUser(req);
        const userId = userHash(user.email);
        const { id } = req.params;
        const apiId = id as string;
        await apisDB.authorize(userId, apiId);
        await apisDB.deleteApi(apiId);
        return res(ctx.status(200), ctx.json({ msg: deleteApiSuccessMsg }));
      } catch (err) {
        console.log("Delete API Error: ", err);
        return res(ctx.status(400), ctx.json({ error: deleteApiErrorMsg }));
      }
    }
  ),

  // PING allApis
  rest.post(customClientFetch(pingAllApisUrl), async (req, res, ctx) => {
    try {
      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      const resp = await apisDB.pingAllApis(userId);
      return res(ctx.status(200), ctx.json({ msg: resp.msg }));
    } catch (err) {
      console.log("Ping All APIs Error: ", err);
      return res(ctx.status(400), ctx.json({ error: pingAllApisErrorMsg }));
    }
  }),

  // PING api
  rest.post(
    customClientFetch(`${pingOneApiUrl}/:id`),
    async (req, res, ctx) => {
      try {
        const user = await usersDB.authenticateUser(req);
        const userId = userHash(user.email);
        const { id } = req.params;
        const apiId = id as string;
        await apisDB.authorize(userId, apiId);
        const resp = await apisDB.pingOneApi(apiId);
        return res(ctx.status(200), ctx.json({ msg: resp.msg }));
      } catch (err) {
        console.log("Ping One API Error: ", err);
        return res(ctx.status(400), ctx.json({ error: pingAllApisErrorMsg }));
      }
    }
  ),
];

export { handlers };
