"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeQueue = exports.startQueue = exports.redisConfiguration = void 0;
const axios_1 = __importDefault(require("axios"));
const bullmq_1 = require("bullmq");
const queue_1 = require("constants/queue");
const dotenv_1 = __importDefault(require("dotenv"));
const apis_1 = require("enum/apis");
const monitor_1 = require("enum/monitor");
const errors_1 = require("errors");
const http_status_codes_1 = require("http-status-codes");
const ioredis_1 = __importDefault(require("ioredis"));
const ApiCollection_1 = __importDefault(require("models/ApiCollection"));
const MonitorCollection_1 = __importDefault(require("models/MonitorCollection"));
const datetime_1 = require("utils/datetime");
const validateUserExists_1 = __importDefault(require("utils/validateUserExists"));
dotenv_1.default.config();
const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, NODE_ENV, REDIS_PASSWORD } = process.env;
const PROD_ENV = NODE_ENV === "production";
const TEST_ENV = NODE_ENV === "test";
exports.redisConfiguration = {
    connection: new ioredis_1.default({
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT),
        username: PROD_ENV ? REDIS_USERNAME : undefined,
        password: PROD_ENV ? REDIS_PASSWORD : undefined,
        maxRetriesPerRequest: null,
    }),
};
const startQueue = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, errors_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
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
            let hour;
            if (dateHour === 12 && dateAMOrPM === monitor_1.MonitorDateAMOrPMOptions.AM) {
                hour = dateHour - 12;
            }
            if (dateHour !== 12 && dateAMOrPM === monitor_1.MonitorDateAMOrPMOptions.PM) {
                hour = dateHour + 12;
            }
            if (dateHour === 12 && dateAMOrPM === monitor_1.MonitorDateAMOrPMOptions.PM) {
                hour = dateHour;
            }
            (0, queue_1.setRepeatOptions)({
                cron: `* ${dateMinute} ${hour} * * ${dateDayOfWeek}`,
                limit: 1,
            });
        }
        if (scheduleType === monitor_1.MonitorScheduleTypeOptions.INTERVAL) {
            switch (intervalSchedule) {
                case monitor_1.MonitorIntervalScheduleOptions.WEEKLY:
                    (0, queue_1.setRepeatOptions)({
                        every: 1000 * 60 * 60 * 24 * 7,
                        limit: 1,
                    });
                    break;
                case monitor_1.MonitorIntervalScheduleOptions.DAILY:
                    (0, queue_1.setRepeatOptions)({
                        every: 1000 * 60 * 60 * 24,
                        limit: 1,
                    });
                    break;
                case monitor_1.MonitorIntervalScheduleOptions.HOURLY:
                    (0, queue_1.setRepeatOptions)({
                        every: 1000 * 60 * 60,
                        limit: 1,
                    });
                    break;
                case monitor_1.MonitorIntervalScheduleOptions.MINUTES:
                    (0, queue_1.setRepeatOptions)({
                        every: 1000 * 60,
                        limit: 1,
                    });
                    break;
                default:
                    (0, queue_1.setRepeatOptions)({
                        every: 1000 * 60 * 60 * 24,
                        limit: 1,
                    });
            }
        }
        (0, queue_1.setQueue)(new bullmq_1.Queue(queueName, exports.redisConfiguration));
        const myQueue = await (0, queue_1.getQueue)();
        const repeatOptions = await (0, queue_1.getRepeatOptions)();
        const queueScheduler = new bullmq_1.QueueScheduler(queueName, exports.redisConfiguration);
        console.log(queueScheduler);
        async function addJobToQueue(jobDetails) {
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
        async function pingAllMonitoredApis() {
            Object.keys(apis).forEach(async (_, index) => {
                try {
                    const res = await axios_1.default.get(apis[index].url);
                    if (res && res.status === 200) {
                        await ApiCollection_1.default.findOneAndUpdate({ _id: apis[index].id }, {
                            status: apis_1.ApiStatusOptions.HEALTHY,
                            lastPinged: (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT),
                        }, {
                            new: true,
                            runValidators: true,
                        });
                    }
                }
                catch (error) {
                    await ApiCollection_1.default.findOneAndUpdate({ _id: apis[index].id }, {
                        status: apis_1.ApiStatusOptions.UNHEALTHY,
                        lastPinged: (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT),
                    }, {
                        new: true,
                        runValidators: true,
                    });
                }
            });
        }
        if (scheduleType === monitor_1.MonitorScheduleTypeOptions.INTERVAL) {
            addJobToQueue(`Ping apis for user at ${intervalSchedule}`);
        }
        if (scheduleType === monitor_1.MonitorScheduleTypeOptions.DATE) {
            addJobToQueue(`Ping apis for user at ${dateDayOfWeek} ${dateHour}:${dateMinute} ${dateAMOrPM}`);
        }
        const worker = new bullmq_1.Worker(queueName, pingAllMonitoredApis, exports.redisConfiguration);
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
        console.log("3: ", exports.redisConfiguration.connection.status);
        res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Started monitoring in queue!" });
    }
    catch (error) {
        (0, errors_1.badRequestError)(res, error);
        return;
    }
};
exports.startQueue = startQueue;
const removeQueue = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, errors_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
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
    }
    catch (error) {
        (0, errors_1.badRequestError)(res, error);
        return;
    }
};
exports.removeQueue = removeQueue;
//# sourceMappingURL=queueController.js.map