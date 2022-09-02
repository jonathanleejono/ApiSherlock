import axios from "axios";
import { Queue, QueueScheduler, Worker } from "bullmq";
import {
  getQueue,
  getRepeatOptions,
  jobBaseName,
  queueBaseName,
  setQueue,
  setRepeatOptions,
} from "constants/queue";
import dotenv from "dotenv";
import { ApiMonitoringOptions, ApiStatusOptions } from "enum/apis";
import {
  MonitorDateAMOrPMOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { badRequestError, notFoundError, unAuthenticatedError } from "errors";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiCollection from "models/ApiCollection";
import MonitorCollection from "models/MonitorCollection";
import { getDateWithUTCOffset } from "utils/datetime";
import validateUserExists from "utils/validateUserExists";

dotenv.config();

const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, NODE_ENV, REDIS_PASSWORD } =
  process.env;

const PROD_ENV = NODE_ENV === "production";

const redisConfiguration = {
  connection: {
    host: REDIS_HOST as string,
    port: parseInt(REDIS_PORT as string),
    username: PROD_ENV ? REDIS_USERNAME : undefined,
    password: PROD_ENV ? REDIS_PASSWORD : undefined,
  },
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

    // cron-parser: second, minute, hour, day of month, month, day of week
    if (scheduleType === MonitorScheduleTypeOptions.DATE) {
      // make sure this is +13 and not +12 because the frontend if off by 1 hour
      const hour =
        dateAMOrPM === MonitorDateAMOrPMOptions.PM ? dateHour + 13 : dateHour;
      setRepeatOptions({
        cron: `* ${dateMinute} ${hour} * * ${dateDayOfWeek}`,
        limit: 1,
      });
    }

    if (scheduleType === MonitorScheduleTypeOptions.INTERVAL) {
      switch (intervalSchedule) {
        case MonitorIntervalScheduleOptions.WEEKLY:
          setRepeatOptions({
            every: 1000 * 60 * 60 * 24 * 7,
            limit: 1,
          });
          break;
        case MonitorIntervalScheduleOptions.DAILY:
          setRepeatOptions({
            every: 1000 * 60 * 60 * 24,
            limit: 1,
          });
          break;
        case MonitorIntervalScheduleOptions.HOURLY:
          setRepeatOptions({
            every: 1000 * 60 * 60,
            limit: 1,
          });
          break;
        case MonitorIntervalScheduleOptions.MINUTES:
          setRepeatOptions({
            every: 1000 * 60,
            limit: 1,
          });
          break;
        default:
          setRepeatOptions({
            every: 1000 * 60 * 60 * 24,
            limit: 1,
          });
      }
    }

    setQueue(new Queue(queueName, redisConfiguration));

    const myQueue = await getQueue();

    const repeatOptions = await getRepeatOptions();

    new QueueScheduler(queueName, redisConfiguration);

    // jobDetails is just a description, but can also hold a value
    // in this case, instead of individually storing each url as a separate job,
    // one job to ping all of the monitored apis is completed
    async function addJobToQueue(jobDetails: any) {
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
      //the try catch is to ignore not found url error
      Object.keys(apis).forEach(async (_, index: number) => {
        try {
          const res = await axios.get(apis[index].url);
          if (res && res.status === 200) {
            await ApiCollection.findOneAndUpdate(
              { _id: apis[index].id },
              {
                status: ApiStatusOptions.HEALTHY,
                lastPinged: getDateWithUTCOffset(user!.timezoneGMT),
              },
              {
                new: true,
                runValidators: true,
              }
            );
          }
        } catch (error) {
          await ApiCollection.findOneAndUpdate(
            { _id: apis[index].id },
            {
              status: ApiStatusOptions.UNHEALTHY,
              lastPinged: getDateWithUTCOffset(user!.timezoneGMT),
            },
            {
              new: true,
              runValidators: true,
            }
          );
        }
      });
    }

    addJobToQueue(`Ping apis for user`);

    const worker = new Worker(
      queueName,
      pingAllMonitoredApis,
      redisConfiguration
    );

    worker.on("completed", async (job) => {
      console.log(`Job ${job.id} has completed!`);
    });

    worker.on("failed", (job, err) => {
      console.error(`Job ${job.id} has failed with ${err.message}`);
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

    res
      .status(StatusCodes.OK)
      .json({ msg: "Stopped monitoring and removed queue" });
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};
