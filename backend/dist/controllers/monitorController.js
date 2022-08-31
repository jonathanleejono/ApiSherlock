"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMonitor = exports.getMonitor = exports.deleteMonitor = exports.createMonitor = void 0;
const messages_1 = require("constants/messages");
const monitor_1 = require("constants/options/monitor");
const index_1 = require("errors/index");
const http_status_codes_1 = require("http-status-codes");
const MonitorCollection_1 = __importDefault(require("models/MonitorCollection"));
const validateKeysValues_1 = require("utils/validateKeysValues");
const validateMonitorDate_1 = require("utils/validateMonitorDate");
const validateUserExists_1 = __importDefault(require("utils/validateUserExists"));
const createMonitor = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const monitorAlreadyExists = await MonitorCollection_1.default.findOne({
            createdBy: user._id,
        });
        if (monitorAlreadyExists) {
            (0, index_1.badRequestError)(res, "Error, can only have one monitor");
            return;
        }
        if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Invalid monitor creation, can only input: `, monitor_1.validCreateMonitorKeys))
            return;
        if ((0, validateKeysValues_1.emptyValuesExist)(res, Object.values(req.body)))
            return;
        const { useInterval, useDate, intervalSchedule, dateDayOfWeek, dateHour, dateMinute, } = req.body;
        if (!useInterval && !useDate) {
            (0, index_1.badRequestError)(res, "One of interval and date schedule must be used, please pick one");
            return;
        }
        if (useInterval && useDate) {
            (0, index_1.badRequestError)(res, "Interval and date schedule can't both be used, please pick one");
            return;
        }
        if (useInterval &&
            !(0, validateKeysValues_1.validValues)(res, intervalSchedule, `Invalid interval schedule, please select one of: `, monitor_1.validMonitorIntervalScheduleOptions))
            return;
        if (useDate && !(0, validateMonitorDate_1.validMonitorDate)(res, dateDayOfWeek, dateHour, dateMinute))
            return;
        req.body.createdBy = user._id;
        const monitor = new MonitorCollection_1.default(req.body);
        await monitor.validate();
        await MonitorCollection_1.default.create(monitor);
        res.status(http_status_codes_1.StatusCodes.CREATED).json(monitor);
    }
    catch (error) {
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.createMonitor = createMonitor;
const getMonitor = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const monitor = await MonitorCollection_1.default.findOne({ createdBy: user._id });
        if (!monitor) {
            (0, index_1.notFoundError)(res, `No monitor found`);
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(monitor);
    }
    catch (error) {
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.getMonitor = getMonitor;
const updateMonitor = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const monitor = await MonitorCollection_1.default.findOne({ createdBy: user._id });
        if (!monitor) {
            (0, index_1.notFoundError)(res, `No monitor found`);
            return;
        }
        if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Error updating monitor, can only use: `, monitor_1.validUpdateMonitorKeys))
            return;
        if ((0, validateKeysValues_1.emptyValuesExist)(res, Object.values(req.body)))
            return;
        const { useInterval, useDate, intervalSchedule, dateDayOfWeek, dateHour, dateMinute, } = req.body;
        if (useInterval && useDate) {
            (0, index_1.badRequestError)(res, "Interval and date schedule can't both be used, please pick one");
            return;
        }
        if (!useInterval && !useDate) {
            (0, index_1.badRequestError)(res, "One of interval and date schedule must be used, please pick one");
            return;
        }
        if (useInterval &&
            !(0, validateKeysValues_1.validValues)(res, intervalSchedule, `Invalid interval schedule, please select one of: `, monitor_1.validMonitorIntervalScheduleOptions))
            return;
        if (useDate && !(0, validateMonitorDate_1.validMonitorDate)(res, dateDayOfWeek, dateHour, dateMinute))
            return;
        Object.assign(monitor, req.body);
        await monitor.validate();
        await monitor.save();
        res.status(http_status_codes_1.StatusCodes.OK).json(monitor);
    }
    catch (error) {
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.updateMonitor = updateMonitor;
const deleteMonitor = async (req, res) => {
    const user = await (0, validateUserExists_1.default)(req, res);
    if (!user) {
        (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    const monitor = await MonitorCollection_1.default.findOne({
        createdBy: user._id,
    });
    if (!monitor) {
        (0, index_1.notFoundError)(res, "Error, no monitor found");
        return;
    }
    await monitor.remove();
    res.status(http_status_codes_1.StatusCodes.OK).json(messages_1.deleteMonitorSuccessMsg);
};
exports.deleteMonitor = deleteMonitor;
//# sourceMappingURL=monitorController.js.map