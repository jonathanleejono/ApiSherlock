import { faker } from "@faker-js/faker";
import {
  createApiErrorMsg,
  deleteApiErrorMsg,
  deleteApiSuccessMsg,
  editApiErrorMsg,
  getAllApisErrorMsg,
  loginUserErrorMsg,
  pingAllApisErrorMsg,
  registerUserErrorMsg,
  updateUserErrorMsg,
} from "constants/messages";
import {
  baseUrl,
  createApiUrl,
  deleteApiUrl,
  editApiUrl,
  getAllApisStatsUrl,
  getAllApisUrl,
  loginUserUrl,
  pingAllApisUrl,
  pingOneApiUrl,
  registerUserUrl,
  updateUserUrl,
} from "constants/urls";
import { rest } from "msw";
import { dateTime } from "test/constants/datetime";
import * as apisDB from "test/data/apisDb";
import * as usersDB from "test/data/usersDb";
import { userHash } from "test/data/usersDb";

const customClientFetch = (path: string) => `${baseUrl}${path}`.toString();

const handlers = [
  // LOGIN user
  rest.post(customClientFetch(loginUserUrl), async (req, res, ctx) => {
    try {
      const { email, password } = await req.json();
      const { user, token } = await usersDB.loginUser({
        email,
        password,
      });
      return res(ctx.status(200), ctx.json({ user, token }));
    } catch (err) {
      console.log("Login User Error: ", err);
      return res(ctx.status(400), ctx.json({ error: loginUserErrorMsg }));
    }
  }),

  // REGISTER user
  rest.post(customClientFetch(registerUserUrl), async (req, res, ctx) => {
    try {
      const { name, email, password } = await req.json();
      const { user, token } = await usersDB.registerUser({
        name,
        email,
        password,
      });
      return res(ctx.json({ user, token }));
    } catch (err) {
      console.log("Register User Error: ", err);
      return res(ctx.status(400), ctx.json({ error: registerUserErrorMsg }));
    }
  }),

  // UPDATE user
  rest.patch(customClientFetch(updateUserUrl), async (req, res, ctx) => {
    // in render-utils.tsx, the auth token is set in loginAsUser()
    // axios/customFetch gets the token and sets it in headers
    // the mock api req uses the token -> the beauty of mock apis!
    try {
      const _user = await usersDB.getUserByToken(req);
      const userId = userHash(_user.email);
      const { name, email } = await req.json();
      const { user, token } = await usersDB.updateUser(userId, {
        name,
        email,
      });
      return res(ctx.json({ user, token }));
    } catch (err) {
      console.log("Update User Error: ", err);
      return res(ctx.status(400), ctx.json({ error: updateUserErrorMsg }));
    }
  }),

  //   GET allApis
  rest.get(customClientFetch(`${getAllApisUrl}`), async (req, res, ctx) => {
    try {
      const user = await usersDB.getUserByToken(req);
      const userId = userHash(user.email);
      const { allApis, totalApis, numOfPages } = await apisDB.getAllApis(
        userId
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
      const user = await usersDB.getUserByToken(req);
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
      const user = await usersDB.getUserByToken(req);
      const userId = userHash(user.email);
      const createdApi = await apisDB.createApi({
        _id: faker.datatype.uuid(),
        createdBy: userId,
        url: url,
        host: host,
        status: "pending",
        lastPinged: "Never pinged",
        monitoring: monitoring,
        createdAt: dateTime,
        updatedAt: dateTime,
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
      const user = await usersDB.getUserByToken(req);
      const userId = userHash(user.email);
      const { id } = req.params;
      const apiId = id as string;
      await apisDB.authorize(userId, apiId);
      const updates = await req.json();
      const updatedApi = await apisDB.updateApi(apiId, updates);
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
        const user = await usersDB.getUserByToken(req);
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
      const user = await usersDB.getUserByToken(req);
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
        const user = await usersDB.getUserByToken(req);
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
