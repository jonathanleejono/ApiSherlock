import { baseUrl } from "constants/apiUrls";
import { rest } from "msw";

const customClientFetch = (path: string) => `${baseUrl}${path}`.toString();

const pingHealthCheckHandler = [
  //   PING Wakeup/Health Check
  rest.get(customClientFetch(`/ping`), async (_, res, ctx) => res(ctx.status(200), ctx.json({ msg: "hello world" }))),
];

export { pingHealthCheckHandler };
