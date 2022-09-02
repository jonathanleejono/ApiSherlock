import {
  baseUrl,
  loginUserUrl,
  refreshAccessTokenUrl,
  registerUserUrl,
  updateUserUrl,
} from "constants/apiUrls";
import {
  loginUserErrorMsg,
  refreshTokenErrorMsg,
  registerUserErrorMsg,
  updateUserErrorMsg,
} from "constants/messages";
import { rest } from "msw";
import * as usersDB from "test/data/usersDb";
import { userHash } from "test/data/usersDb";

const customClientFetch = (path: string) => `${baseUrl}${path}`.toString();

//this is set in the "refresh token" handler
export let newAccessToken: string;

const { NODE_ENV } = process.env;

const PROD_ENV = NODE_ENV === "production";

const handlers = [
  // LOGIN user
  rest.post(customClientFetch(loginUserUrl), async (req, res, ctx) => {
    try {
      const { email, password } = await req.json();
      const { user, accessToken } = await usersDB.loginUser({
        email,
        password,
      });

      const userId = userHash(user.email);
      const refreshToken = usersDB.generateToken(userId);

      return res(
        ctx.status(200),
        ctx.json({ user, accessToken }),
        ctx.cookie(usersDB.cookieName, refreshToken, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          secure: PROD_ENV ? true : false,
          sameSite: PROD_ENV ? "none" : "lax",
        })
      );
    } catch (err) {
      console.log("Login User Error: ", err);
      return res(ctx.status(400), ctx.json({ error: loginUserErrorMsg }));
    }
  }),

  // REGISTER user
  rest.post(customClientFetch(registerUserUrl), async (req, res, ctx) => {
    try {
      const { name, email, password, timezoneGMT } = await req.json();
      const { user, accessToken } = await usersDB.registerUser({
        name,
        email,
        password,
        timezoneGMT,
      });

      const userId = userHash(user.email);
      const refreshToken = usersDB.generateToken(userId);

      return res(
        ctx.status(201),
        ctx.json({ user, accessToken }),
        ctx.cookie(usersDB.cookieName, refreshToken, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          secure: PROD_ENV ? true : false,
          sameSite: PROD_ENV ? "none" : "lax",
        })
      );
    } catch (err) {
      console.log("Register User Error: ", err);
      return res(ctx.status(400), ctx.json({ error: registerUserErrorMsg }));
    }
  }),

  // UPDATE user
  rest.patch(customClientFetch(updateUserUrl), async (req, res, ctx) => {
    // in render-utils.tsx, the auth accessToken is set in loginAsUser()
    // axios/customFetch gets the accessToken and sets it in headers
    // the mock api req uses the accessToken -> the beauty of mock apis!
    try {
      const _user = await usersDB.authenticateUser(req);
      const userId = userHash(_user.email);
      const { name, email } = await req.json();
      const { user, accessToken } = await usersDB.updateUser(userId, {
        name,
        email,
      });
      return res(ctx.json({ user, accessToken }));
    } catch (err) {
      console.log("Update User Error: ", err);
      return res(ctx.status(400), ctx.json({ error: updateUserErrorMsg }));
    }
  }),

  // REFRESH token
  rest.get(customClientFetch(refreshAccessTokenUrl), async (_, res, ctx) => {
    try {
      newAccessToken = usersDB.generateToken("fakeUserId");
      return res(ctx.json({ accessToken: newAccessToken }));
    } catch (err) {
      console.log("Refresh Token Error: ", err);
      return res(ctx.status(400), ctx.json({ error: refreshTokenErrorMsg }));
    }
  }),
];

export { handlers };
