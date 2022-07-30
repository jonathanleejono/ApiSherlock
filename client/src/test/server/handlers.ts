import { baseUrl, apiApiUrl, authApiUrl } from "constants/urls";
import UnAuthenticatedError from "errors/unauthenticated";
import { rest } from "msw";
import * as listItemsDB from "test/mocks/listItemsDb";
import * as usersDB from "test/mocks/usersDb";

const appAuthUrl = `${baseUrl}${authApiUrl}`;
const appApiUrl = `${baseUrl}${apiApiUrl}`;

const handlers = [
  rest.post(`${appAuthUrl}/login`, async (req, res, ctx) => {
    const { _id, name, email, password } = await req.json();
    const { user, token } = await usersDB.authenticateUser({
      _id,
      name,
      email,
      password,
    });
    return res(ctx.json({ user, token }));
  }),

  rest.post(`${appAuthUrl}/register`, async (req, res, ctx) => {
    const { _id, name, email, password } = await req.json();
    const userFields = { _id, name, email, password };
    await usersDB.createUser(userFields);

    try {
      const { user, token } = await usersDB.authenticateUser(userFields);
      return res(ctx.json({ user, token }));
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({ status: 400, message: error.message })
      );
    }
  }),

  //   GET allApis
  rest.get(`${appApiUrl}`, async (req, res, ctx) => {
    try {
      console.log("get all apis");
      const user = await getUser(req);
      const { allApis, totalApis, numOfPages } = await listItemsDB.getMockApis(
        user._id
      );

      console.log("allApis: ", allApis);

      return res(ctx.json({ allApis, totalApis, numOfPages }));
    } catch (error) {
      console.log("get all apis error: ", error);
      return error;
    }
  }),

  //   GET api
  rest.get(`${appApiUrl}/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const apiId = id as string;
    const api = await listItemsDB.getApiById(apiId);
    if (!api) {
      return res(
        ctx.status(404),
        ctx.json({ status: 404, message: "API not found" })
      );
    }
    return res(ctx.json({ api }));
  }),

  rest.post(`${appApiUrl}`, async (req, res, ctx) => {
    try {
      console.log("testing post create api request");
      const { url, host, monitoring } = await req.json();
      const user = await getUser(req);
      const createdApi = await listItemsDB.createApi({
        _id: "1234",
        createdBy: user._id,
        url: url,
        host: host,
        status: "pending",
        lastPinged: "Never pinged",
        monitoring: monitoring,
      });
      console.log("createdApi: ", createdApi);
      return res(ctx.status(200), ctx.json({ api: { createdApi } }));
    } catch (error) {
      return res(ctx.status(400), ctx.json("error"));
    }
  }),

  rest.patch(`${appApiUrl}/:id`, async (req, res, ctx) => {
    try {
      const user = await getUser(req);
      const { id } = req.params;
      const apiId = id as string;
      await listItemsDB.authorize(user._id, apiId);
      const updates = await req.json();
      const updatedListItem = await listItemsDB.updateApi(apiId, updates);
      return res(ctx.json(updatedListItem));
    } catch (error) {
      console.log("patch error: ", error);
      return error;
    }
  }),

  rest.delete(`${appApiUrl}/:id`, async (req, res, ctx) => {
    try {
      const user = await getUser(req);
      const { id } = req.params;
      const apiId = id as string;
      await listItemsDB.authorize(user._id, apiId);
      await listItemsDB.deleteApi(apiId);
      return res(ctx.status(200), ctx.json({ msg: "Success! Api removed" }));
    } catch (error) {
      console.log("delete error: ", error);
      return error;
    }
  }),
];

export const getToken = (req) =>
  req.headers.get("Authorization")?.replace("Bearer ", "");

export async function getUserId(req) {
  const token = getToken(req);
  if (!token) {
    const error = new UnAuthenticatedError("A token must be provided");
    error.statusCode = 401;
    throw error;
  }
  let userId;
  try {
    userId = Buffer.from(token, "base64").toString("utf8");
  } catch (e) {
    const error = new UnAuthenticatedError(
      "Invalid token. Please login again."
    );
    error.statusCode = 401;
    throw error;
  }
  return userId;
}

export async function getUser(req) {
  const token = getToken(req);
  if (!token) {
    const error = new UnAuthenticatedError("A token must be provided");
    error.statusCode = 401;
    throw error;
  }
  let userId;
  try {
    userId = Buffer.from(token, "base64").toString("utf8");
  } catch (e) {
    const error = new UnAuthenticatedError(
      "Invalid token. Please login again."
    );
    error.statusCode = 401;
    throw error;
  }
  const user = await usersDB.getUserById(userId);
  return user;
}

export { handlers };
