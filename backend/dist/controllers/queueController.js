"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeQueue = exports.startQueue = void 0;
const bullmq_1 = require("bullmq");
const envVars_1 = require("constants/envVars");
const queue_1 = require("constants/queue");
const connectRedisDB_1 = __importDefault(require("db/connectRedisDB"));
const apis_1 = require("enum/apis");
const monitor_1 = require("enum/monitor");
const errors_1 = require("errors");
const http_status_codes_1 = require("http-status-codes");
const ApiCollection_1 = __importDefault(require("models/ApiCollection"));
const MonitorCollection_1 = __importDefault(require("models/MonitorCollection"));
const getUser_1 = __importDefault(require("utils/getUser"));
const pingApis_1 = require("utils/pingApis");
const getCronUTCTime_1 = require("utils/queue/getCronUTCTime");
const getQueueHour_1 = require("utils/queue/getQueueHour");
const setQueueIntervalSchedule_1 = require("utils/queue/setQueueIntervalSchedule");
const startQueue = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, errors_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    const redisConfiguration = await (0, connectRedisDB_1.default)();
    const queueName = `${queue_1.queueBaseName}-${user.email}`;
    const jobName = `${queue_1.jobBaseName}-${user.email}`;
    const monitor = await MonitorCollection_1.default.findOne({ createdBy: user._id });
    if (!monitor) {
        (0, errors_1.notFoundError)(res, `No monitor found`);
        return;
    }
    if (monitor.monitorSetting !== monitor_1.MonitorSettingOptions.ON) {
        (0, errors_1.badRequestError)(res, `Monitor must be on to start queue`);
        return;
    }
    const { scheduleType, intervalSchedule, dateDayOfWeek, dateHour, dateMinute, dateAMOrPM, } = monitor;
    if (scheduleType === monitor_1.MonitorScheduleTypeOptions.DATE) {
        const hour = (0, getQueueHour_1.getQueueHour)(dateHour, dateAMOrPM);
        const cronUTCTime = await (0, getCronUTCTime_1.getCronUTCTime)({
            timezone: user.timezoneGMT,
            inputDay: dateDayOfWeek,
            inputHour: hour,
            inputMinute: dateMinute,
        });
        (0, queue_1.setRepeatOptions)({
            pattern: envVars_1.PROD_ENV
                ? cronUTCTime
                : `* ${dateMinute} ${hour} * * ${dateDayOfWeek}`,
            limit: 2,
        });
    }
    if (scheduleType === monitor_1.MonitorScheduleTypeOptions.INTERVAL) {
        (0, setQueueIntervalSchedule_1.setQueueIntervalSchedule)(intervalSchedule);
    }
    (0, queue_1.setQueue)(new bullmq_1.Queue(queueName, redisConfiguration));
    const myQueue = await (0, queue_1.getQueue)();
    const repeatOptions = await (0, queue_1.getRepeatOptions)();
    (0, queue_1.setQueueScheduler)(new bullmq_1.QueueScheduler(queueName, {
        connection: redisConfiguration.connection.duplicate(),
    }));
    async function addJobToQueue(jobDetails) {
        console.log(jobDetails);
        await myQueue.add(jobName, { jobDetails }, { repeat: repeatOptions });
    }
    const apis = await ApiCollection_1.default.find({
        createdBy: user._id,
        monitoring: apis_1.ApiMonitoringOptions.ON,
    });
    if (!apis || !(apis.length > 0)) {
        (0, errors_1.notFoundError)(res, `No APIs found`);
        return;
    }
    if (scheduleType === monitor_1.MonitorScheduleTypeOptions.INTERVAL) {
        addJobToQueue(`Ping apis for user at ${intervalSchedule}`);
    }
    if (scheduleType === monitor_1.MonitorScheduleTypeOptions.DATE) {
        const minute = dateMinute < 10 ? `0${dateMinute}` : dateMinute;
        addJobToQueue(`Ping apis for user at ${monitor_1.MonitorDateDayOfWeekOptions[dateDayOfWeek]} ${dateHour}:${minute} ${dateAMOrPM} (GMT ${user.timezoneGMT})`);
    }
    (0, queue_1.setQueueWorker)(new bullmq_1.Worker(queueName, async (_) => {
        await (0, pingApis_1.pingApis)(apis, user);
    }, redisConfiguration));
    const worker = await (0, queue_1.getQueueWorker)();
    worker.on("completed", async (job) => {
        if (!envVars_1.TEST_ENV) {
            console.log(`Job ${job.id} has completed!`);
        }
    });
    worker.on("failed", async (job, err) => {
        if (!envVars_1.TEST_ENV) {
            console.error(`Job ${job.id} has failed with ${err.message}`);
        }
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Started monitoring in queue!" });
};
exports.startQueue = startQueue;
const removeQueue = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, errors_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    await (0, connectRedisDB_1.default)();
    const monitor = await MonitorCollection_1.default.findOne({ createdBy: user._id });
    if (monitor) {
        (0, errors_1.badRequestError)(res, `Monitor must be deleted to stop queue`);
        return;
    }
    const myQueue = await (0, queue_1.getQueue)();
    if (!myQueue) {
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Monitoring stopped" });
        return;
    }
    await myQueue.obliterate();
    await myQueue.close();
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "Stopped monitoring and removed queue" });
};
exports.removeQueue = removeQueue;
//# sourceMappingURL=queueController.js.map