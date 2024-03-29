"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const monitor_1 = require("constants/options/monitor");
const monitor_2 = require("enum/monitor");
const mongoose_1 = __importStar(require("mongoose"));
const MonitorSchema = new mongoose_1.default.Schema({
    monitorSetting: {
        type: String,
        required: [true, "Please specify if monitor is on or off"],
        default: monitor_2.MonitorSettingOptions.OFF,
    },
    scheduleType: {
        type: String,
        required: [true, "Please specify schedule type"],
        default: monitor_2.MonitorScheduleTypeOptions.INTERVAL,
    },
    intervalSchedule: {
        type: String,
        enum: monitor_1.validMonitorIntervalScheduleOptions,
        default: monitor_2.MonitorIntervalScheduleOptions.WEEKLY,
    },
    dateDayOfWeek: {
        type: Number,
        enum: monitor_1.validMonitorDateDayOfWeekOptions,
        default: monitor_2.MonitorDateDayOfWeekOptions.Sunday,
    },
    dateHour: {
        type: Number,
        enum: monitor_1.validMonitorDateHourOptions,
        default: 12,
    },
    dateMinute: {
        type: Number,
        enum: monitor_1.validMonitorDateMinuteOptions,
        default: 0,
    },
    dateAMOrPM: {
        type: String,
        enum: monitor_1.validMonitorDateAMorPMOptions,
        default: monitor_2.MonitorDateAMOrPMOptions.AM,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"],
    },
}, { timestamps: true });
const MonitorCollection = mongoose_1.default.model("Monitor", MonitorSchema);
exports.default = MonitorCollection;
//# sourceMappingURL=MonitorCollection.js.map