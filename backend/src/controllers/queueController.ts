import { Queue, QueueScheduler, Worker } from "bullmq";
import { PROD_ENV, TEST_ENV } from "constants/envVars";
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
import connectRedisDB from "db/connectRedisDB";
import { ApiMonitoringOptions } from "enum/apis";
import {
  MonitorDateDayOfWeekOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { badRequestError, notFoundError, unAuthenticatedError } from "errors";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiCollection from "models/ApiCollection";
import MonitorCollection from "models/MonitorCollection";
import getUser from "utils/getUser";
import { pingApis } from "utils/pingApis";
import { getCronUTCTime } from "utils/queue/getCronUTCTime";
import { getQueueHour } from "utils/queue/getQueueHour";
import { setQueueIntervalSchedule } from "utils/queue/setQueueIntervalSchedule";

export const startQueue = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await getUser(req, res);

  if (!user) {
    unAuthenticatedError(res, "Invalid Credentials");
    return;
  }

  const redisConfiguration = await connectRedisDB();

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

  if (scheduleType === MonitorScheduleTypeOptions.DATE) {
    const hour = getQueueHour(dateHour, dateAMOrPM);

    //the server online uses UTC time, which is why cron is converted
    const cronUTCTime = await getCronUTCTime({
      timezone: user.timezoneGMT,
      inputDay: dateDayOfWeek,
      inputHour: hour,
      inputMinute: dateMinute,
    });

    // using "limit: 2" with pattern/cron means do it twice when
    // the time is met (eg. do it twice at Sun 10:00AM, and do it twice next Sun 10:00AM)
    // which is not the same as using limit with "every" prop
    setRepeatOptions({
      pattern: PROD_ENV
        ? cronUTCTime
        : `* ${dateMinute} ${hour} * * ${dateDayOfWeek}`,
      limit: 2,
    });
  }

  if (scheduleType === MonitorScheduleTypeOptions.INTERVAL) {
    setQueueIntervalSchedule(intervalSchedule);
  }

  setQueue(new Queue(queueName, redisConfiguration));

  const myQueue = await getQueue();

  const repeatOptions = await getRepeatOptions();

  // QueueScheduler requires blocking connections and can't
  // reuse existing connections, which is why connection is duplicated
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
    new Worker(
      queueName,
      async (_) => {
        await pingApis(apis, user);
      },
      redisConfiguration
    )
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
};

export const removeQueue = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await getUser(req, res);

  if (!user) {
    unAuthenticatedError(res, "Invalid Credentials");
    return;
  }

  await connectRedisDB();

  const monitor = await MonitorCollection.findOne({ createdBy: user._id });

  if (monitor) {
    badRequestError(res, `Monitor must be deleted to stop queue`);
    return;
  }

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
};
