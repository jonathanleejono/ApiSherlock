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
const monitorTime_1 = require("constants/monitorTime");
const monitor_1 = require("enum/monitor");
const mongoose_1 = __importStar(require("mongoose"));
const MonitorSchema = new mongoose_1.default.Schema({
    monitoringOn: {
        type: Boolean,
        required: [true, "Please specify if monitoring is on or off"],
        default: false,
    },
    useInterval: {
        type: Boolean,
        required: [true, "Please specify if interval is used"],
        default: false,
    },
    useDate: {
        type: Boolean,
        required: [true, "Please specify if date is used"],
        default: false,
    },
    intervalSchedule: {
        type: String,
        enum: monitor_1.monitorIntervalScheduleOptions,
        required: [true, "Please provide interval schedule"],
        default: monitor_1.MonitorIntervalScheduleOptions.WEEKLY,
    },
    dateDayOfWeek: {
        type: Number,
        enum: monitor_1.monitorDateDayOfWeekOptions,
        required: [true, "Please provide day of week"],
        default: monitor_1.MonitorDateDayOfWeekOptions.MONDAY,
    },
    dateHour: {
        type: Number,
        enum: monitorTime_1.monitorDateHourOptions,
        required: [true, "Please provide monitoring hour"],
        default: 0,
    },
    dateMinute: {
        type: Number,
        enum: monitorTime_1.monitorDateMinuteOptions,
        required: [true, "Please provide monitoring minutes"],
        default: 0,
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