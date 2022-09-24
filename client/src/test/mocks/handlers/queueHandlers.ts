import { baseUrl, handleQueueUrl } from "constants/apiUrls";
import { removeQueueErrorMsg, startQueueErrorMsg } from "constants/messages";
import { rest } from "msw";
import * as queueDB from "test/data/queueDb";
import * as usersDB from "test/data/usersDb";
import { userHash } from "test/data/usersDb";

const customClientFetch = (path: string) => `${baseUrl}${path}`.toString();

const queueHandlers = [
  //   START queue
  rest.post(customClientFetch(handleQueueUrl), async (req, res, ctx) => {
    try {
      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      const resp = await queueDB.startQueue(userId);
      return res(
        ctx.json({
          msg: resp,
        })
      );
    } catch (err) {
      console.log("Start Queue Error: ", err);
      return res(ctx.status(400), ctx.json({ error: startQueueErrorMsg }));
    }
  }),

  // DELETE monitor
  rest.delete(customClientFetch(handleQueueUrl), async (req, res, ctx) => {
    try {
      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      const resp = await queueDB.removeQueue(userId);
      return res(ctx.status(200), ctx.json({ msg: resp }));
    } catch (err) {
      console.log("Remove Queue Error: ", err);
      return res(ctx.status(400), ctx.json({ error: removeQueueErrorMsg }));
    }
  }),
];

export { queueHandlers };
