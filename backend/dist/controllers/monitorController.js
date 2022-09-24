"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMonitor = exports.getMonitor = exports.deleteMonitor = exports.createMonitor = void 0;
const messages_1 = require("constants/messages");
const monitor_1 = require("constants/options/monitor");
const monitor_2 = require("enum/monitor");
const index_1 = require("errors/index");
const http_status_codes_1 = require("http-status-codes");
const MonitorCollection_1 = __importDefault(require("models/MonitorCollection"));
const getUser_1 = __importDefault(require("utils/getUser"));
const validateKeysValues_1 = require("utils/validateKeysValues");
const validateMonitorDate_1 = require("utils/validateMonitorDate");
const createMonitor = async (req, res) => {
    try {
        const user = await (0, getUser_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const monitorAlreadyExists = await MonitorCollection_1.default.findOne({
            createdBy: user._id,
        });
        if (monitorAlreadyExists) {
            (0, index_1.badRequestError)(res, "Error, can only have one monitor, please turn off to remove");
            return;
        }
        if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Invalid monitor creation, can only input: `, monitor_1.validCreateMonitorKeys))
            return;
        if ((0, validateKeysValues_1.emptyValuesExist)(res, Object.values(req.body)))
            return;
        const { monitorSetting, scheduleType, intervalSchedule, dateDayOfWeek, dateHour, dateMinute, dateAMOrPM, } = req.body;
        if (!(0, validateKeysValues_1.validValues)(res, monitorSetting, `Invalid monitor setting, please select one of: `, monitor_1.validMonitorSettingOptions))
            return;
        if (monitorSetting !== monitor_2.MonitorSettingOptions.ON) {
            (0, index_1.badRequestError)(res, "Monitor setting must be on to add monitor");
            return;
        }
        if (!(0, validateKeysValues_1.validValues)(res, scheduleType, `Invalid schedule type, please select one of: `, monitor_1.validMonitorScheduleTypeOptions))
            return;
        if (scheduleType === monitor_2.MonitorScheduleTypeOptions.INTERVAL &&
            !(0, validateKeysValues_1.validValues)(res, intervalSchedule, `Invalid interval schedule, please select one of: `, monitor_1.validMonitorIntervalScheduleOptions))
            return;
        if (scheduleType === monitor_2.MonitorScheduleTypeOptions.DATE &&
            !(0, validateMonitorDate_1.validMonitorDate)(res, dateDayOfWeek, dateHour, dateMinute, dateAMOrPM))
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
        const user = await (0, getUser_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const monitor = await MonitorCollection_1.default.findOne({ createdBy: user._id });
        if (!monitor) {
            const _monitor = {
                monitorSetting: monitor_2.MonitorSettingOptions.OFF,
                scheduleType: monitor_2.MonitorScheduleTypeOptions.INTERVAL,
                intervalSchedule: monitor_2.MonitorIntervalScheduleOptions.WEEKLY,
                dateDayOfWeek: monitor_1.validMonitorDateDayOfWeekOptions[0],
                dateHour: monitor_1.validMonitorDateHourOptions[0],
                dateMinute: monitor_1.validMonitorDateMinuteOptions[0],
                dateAMOrPM: monitor_2.MonitorDateAMOrPMOptions.AM,
            };
            res.status(http_status_codes_1.StatusCodes.OK).json(_monitor);
        }
        else {
            res.status(http_status_codes_1.StatusCodes.OK).json(monitor);
        }
    }
    catch (error) {
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.getMonitor = getMonitor;
const updateMonitor = async (req, res) => {
    try {
        const user = await (0, getUser_1.default)(req, res);
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
        const { scheduleType, intervalSchedule, dateDayOfWeek, dateHour, dateMinute, dateAMOrPM, } = req.body;
        if (scheduleType &&
            !(0, validateKeysValues_1.validValues)(res, scheduleType, `Invalid schedule type, please select one of: `, monitor_1.validMonitorScheduleTypeOptions))
            return;
        if (scheduleType === monitor_2.MonitorScheduleTypeOptions.INTERVAL &&
            !(0, validateKeysValues_1.validValues)(res, intervalSchedule, `Invalid interval schedule, please select one of: `, monitor_1.validMonitorIntervalScheduleOptions))
            return;
        if (scheduleType === monitor_2.MonitorScheduleTypeOptions.DATE &&
            !(0, validateMonitorDate_1.validMonitorDate)(res, dateDayOfWeek, dateHour, dateMinute, dateAMOrPM))
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
    const user = await (0, getUser_1.default)(req, res);
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
    if (monitor.monitorSetting === monitor_2.MonitorSettingOptions.ON) {
        (0, index_1.badRequestError)(res, "Monitor setting must be off to remove monitor");
        return;
    }
    await monitor.remove();
    res.status(http_status_codes_1.StatusCodes.OK).json(messages_1.deleteMonitorSuccessMsg);
};
exports.deleteMonitor = deleteMonitor;
//# sourceMappingURL=monitorController.js.map