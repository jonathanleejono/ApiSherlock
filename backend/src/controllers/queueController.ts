import axios from "axios";
import { Queue, QueueScheduler, Worker } from "bullmq";
import {
  getQueue,
  getQueueWorker,
  getRepeatOptions,
  jobBaseName,
  queueBaseName,
  setQueue,
  setQueueScheduler,
  setQueueWorker,
  setRepeatOptions,
} from "constants/queue";
import dotenv from "dotenv";
import { ApiMonitoringOptions, ApiStatusOptions } from "enum/apis";
import {
  MonitorDateAMOrPMOptions,
  MonitorDateDayOfWeekOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { badRequestError, notFoundError, unAuthenticatedError } from "errors";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Redis from "ioredis";
import ApiCollection from "models/ApiCollection";
import MonitorCollection from "models/MonitorCollection";
import { getDateWithUTCOffset } from "utils/datetime";
import { getCronUTCTime } from "utils/getCronUTCTime";
import validateUserExists from "utils/validateUserExists";

dotenv.config();

const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, NODE_ENV, REDIS_PASSWORD } =
  process.env;

const PROD_ENV = NODE_ENV === "production";
const TEST_ENV = NODE_ENV === "test";

export const redisConfiguration = {
  connection: new Redis({
    host: REDIS_HOST as string,
    port: parseInt(REDIS_PORT as string),
    username: PROD_ENV ? (REDIS_USERNAME as string) : undefined,
    password: PROD_ENV ? (REDIS_PASSWORD as string) : undefined,
    maxRetriesPerRequest: null,
  }),
};

export const startQueue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }
    const queueName = `${queueBaseName}-${user.email}`;

    const jobName = `${jobBaseName}-${user.email}`;

    const monitor = await MonitorCollection.findOne({ createdBy: user._id });

    if (!monitor) {
      notFoundError(res, `No monitor found`);
      return;
    }

    if (monitor.monitorSetting !== MonitorSettingOptions.ON) {
      badRequestError(res, `Monitor must be on to start queue`);
      return;
    }

    const {
      scheduleType,
      intervalSchedule,
      dateDayOfWeek,
      dateHour,
      dateMinute,
      dateAMOrPM,
    } = monitor;

    //first get user's selected monitoring time
    //then, convert that monitoring time to cron time (in user's timezone)
    //finally, convert cron time into UTC cron time (to match server)

    if (scheduleType === MonitorScheduleTypeOptions.DATE) {
      let hour = dateHour; // put default value of dateHour

      //if it's 12AM, the hour should be 0:00AM to match cron
      if (dateHour === 12 && dateAMOrPM === MonitorDateAMOrPMOptions.AM) {
        hour = dateHour - 12;
      }

      //if it's PM and not 12PM, add 12 hours, eg. 3PM -> 15:00
      if (dateHour !== 12 && dateAMOrPM === MonitorDateAMOrPMOptions.PM) {
        hour = dateHour + 12;
      }

      //if it's 12PM, don't add or subtract anything, leave as 12:00
      if (dateHour === 12 && dateAMOrPM === MonitorDateAMOrPMOptions.PM) {
        hour = dateHour;
      }

      const cronUTCTime = await getCronUTCTime({
        timezone: user.timezoneGMT,
        inputDay: dateDayOfWeek,
        inputHour: hour,
        inputMinute: dateMinute,
      });

      //the server online uses UTC time, which is why cron is converted
      setRepeatOptions({
        pattern: PROD_ENV
          ? cronUTCTime
          : `* ${dateMinute} ${hour} * * ${dateDayOfWeek}`,
        limit: 2,
      }); //limit 2 with cron/pattern means do it twice when
      // the time is met (eg. do it twice at Sun 10:00AM, and do it twice next Sun 10:00AM)
    }

    // limit 2 means repeats twice in the entire lifespan and stop,
    // which is different from limit 2 with pattern/cron
    // (eg. repeat once at hour 1, repeat twice at hour 2, and then stop)
    if (scheduleType === MonitorScheduleTypeOptions.INTERVAL) {
      switch (intervalSchedule) {
        case MonitorIntervalScheduleOptions.WEEKLY:
          setRepeatOptions({
            every: 1000 * 60 * 60 * 24 * 7,
            limit: 2,
          });
          break;
        case MonitorIntervalScheduleOptions.DAILY:
          setRepeatOptions({
            every: 1000 * 60 * 60 * 24,
            limit: 2,
          });
          break;
        case MonitorIntervalScheduleOptions.HOURLY:
          setRepeatOptions({
            every: 1000 * 60 * 60,
            limit: 2,
          });
          break;
        case MonitorIntervalScheduleOptions.MINUTES:
          setRepeatOptions({
            every: 1000 * 60,
            limit: 2,
          });
          break;
        default:
          setRepeatOptions({
            every: 1000 * 60 * 60 * 24,
            limit: 2,
          });
      }
    }

    setQueue(new Queue(queueName, redisConfiguration));

    const myQueue = await getQueue();

    const repeatOptions = await getRepeatOptions();

    setQueueScheduler(
      new QueueScheduler(queueName, {
        connection: redisConfiguration.connection.duplicate(),
      })
    );

    // jobDetails is just a description, but can also hold a value
    // in this case, instead of individually storing each url as a separate job,
    // one job to ping all of the monitored apis is completed
    async function addJobToQueue(jobDetails: any) {
      console.log(jobDetails);
      await myQueue.add(jobName, { jobDetails }, { repeat: repeatOptions });
    }

    const apis = await ApiCollection.find({
      createdBy: user._id,
      monitoring: ApiMonitoringOptions.ON,
    });

    if (!apis || !(apis.length > 0)) {
      notFoundError(res, `No APIs found`);
      return;
    }

    async function pingAllMonitoredApis() {
      await Promise.all(
        apis.map(async (api) => {
          axios
            .get(api.url)
            .then(() => {
              api.status = ApiStatusOptions.HEALTHY;
              api.lastPinged = getDateWithUTCOffset(user!.timezoneGMT);

              api.save();
            })
            .catch(() => {
              api.status = ApiStatusOptions.UNHEALTHY;
              api.lastPinged = getDateWithUTCOffset(user!.timezoneGMT);

              api.save();
            });
        })
      );
    }

    if (scheduleType === MonitorScheduleTypeOptions.INTERVAL) {
      addJobToQueue(`Ping apis for user at ${intervalSchedule}`);
    }

    if (scheduleType === MonitorScheduleTypeOptions.DATE) {
      const minute = dateMinute < 10 ? `0${dateMinute}` : dateMinute;
      addJobToQueue(
        `Ping apis for user at ${MonitorDateDayOfWeekOptions[dateDayOfWeek]} ${dateHour}:${minute} ${dateAMOrPM} (GMT ${user.timezoneGMT})`
      );
    }

    setQueueWorker(
      new Worker(queueName, pingAllMonitoredApis, redisConfiguration)
    );

    const worker = await getQueueWorker();

    worker.on("completed", async (job) => {
      if (!TEST_ENV) {
        console.log(`Job ${job.id} has completed!`);
      }
    });

    worker.on("failed", async (job, err) => {
      if (!TEST_ENV) {
        console.error(`Job ${job.id} has failed with ${err.message}`);
      }
    });

    res.status(StatusCodes.OK).json({ msg: "Started monitoring in queue!" });
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

export const removeQueue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const monitor = await MonitorCollection.findOne({ createdBy: user._id });

    if (monitor) {
      badRequestError(res, `Monitor must be deleted to stop queue`);
      return;
    }

    // can optionally stop individual jobs like this:
    // const repeatOptions = await getRepeatOptions();
    // const jobName = `${jobBaseName}-${user.email}`;
    // await myQueue.removeRepeatable(jobName, repeatOptions);

    const myQueue = await getQueue();

    if (!myQueue) {
      res.status(StatusCodes.OK).json({ msg: "Monitoring stopped" });
      return;
    }

    await myQueue.obliterate();

    await myQueue.close();

    res
      .status(StatusCodes.OK)
      .json({ msg: "Stopped monitoring and removed queue" });
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};
