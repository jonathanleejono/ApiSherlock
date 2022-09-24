import { baseUrl, handleMonitorUrl } from "constants/apiUrls";
import {
  createMonitorErrorMsg,
  deleteMonitorErrorMsg,
  deleteMonitorSuccessMsg,
  editMonitorErrorMsg,
  getAllApisErrorMsg,
} from "constants/messages";
import { rest } from "msw";
import * as monitorDB from "test/data/monitorDb";
import * as usersDB from "test/data/usersDb";
import { userHash } from "test/data/usersDb";

const customClientFetch = (path: string) => `${baseUrl}${path}`.toString();

const monitorHandlers = [
  //   GET monitor
  rest.get(customClientFetch(handleMonitorUrl), async (req, res, ctx) => {
    try {
      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      const {
        _id,
        monitorSetting,
        scheduleType,
        intervalSchedule,
        dateDayOfWeek,
        dateHour,
        dateMinute,
        dateAMOrPM,
        createdBy,
        __v,
        createdAt,
        updatedAt,
      } = await monitorDB.getMonitorByUserId(userId);
      return res(
        ctx.json({
          _id,
          monitorSetting,
          scheduleType,
          intervalSchedule,
          dateDayOfWeek,
          dateHour,
          dateMinute,
          dateAMOrPM,
          createdBy,
          __v,
          createdAt,
          updatedAt,
        })
      );
    } catch (err) {
      console.log("Get Monitor Error: ", err);
      return res(ctx.status(400), ctx.json({ error: getAllApisErrorMsg }));
    }
  }),

  // CREATE monitor
  rest.post(customClientFetch(handleMonitorUrl), async (req, res, ctx) => {
    try {
      const {
        monitorSetting,
        scheduleType,
        intervalSchedule,
        dateDayOfWeek,
        dateHour,
        dateMinute,
        dateAMOrPM,
      } = await req.json();
      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      const createdMonitor = await monitorDB.createMonitor({
        createdBy: userId,
        monitorSetting,
        scheduleType,
        intervalSchedule,
        dateDayOfWeek,
        dateHour,
        dateMinute,
        dateAMOrPM,
      });

      return res(ctx.status(201), ctx.json(createdMonitor));
    } catch (err) {
      console.log("Create Monitor Error: ", err);
      return res(ctx.status(400), ctx.json({ error: createMonitorErrorMsg }));
    }
  }),

  // UPDATE monitor
  rest.patch(customClientFetch(handleMonitorUrl), async (req, res, ctx) => {
    try {
      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      const updates = await req.json();
      const updatedMonitor = await monitorDB.updateMonitor(userId, updates);
      return res(ctx.json(updatedMonitor));
    } catch (err) {
      console.log("Update Monitor Error: ", err);
      return res(ctx.status(400), ctx.json({ error: editMonitorErrorMsg }));
    }
  }),

  // DELETE monitor
  rest.delete(customClientFetch(handleMonitorUrl), async (req, res, ctx) => {
    try {
      const user = await usersDB.authenticateUser(req);
      const userId = userHash(user.email);
      await monitorDB.deleteMonitor(userId);
      return res(ctx.status(200), ctx.json({ msg: deleteMonitorSuccessMsg }));
    } catch (err) {
      console.log("Delete Monitor Error: ", err);
      return res(ctx.status(400), ctx.json({ error: deleteMonitorErrorMsg }));
    }
  }),
];

export { monitorHandlers };
