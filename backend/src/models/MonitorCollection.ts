import {
  monitorDateHourOptions,
  monitorDateMinuteOptions,
} from "constants/monitorTime";
import {
  MonitorDateDayOfWeekOptions,
  monitorDateDayOfWeekOptions,
  MonitorIntervalScheduleOptions,
  monitorIntervalScheduleOptions,
} from "enum/monitor";
import MonitorDocument from "models/MonitorDocument";
import mongoose, { Model, Schema } from "mongoose";

const MonitorSchema: Schema<MonitorDocument> = new mongoose.Schema(
  {
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
      enum: monitorIntervalScheduleOptions,
      required: [true, "Please provide interval schedule"],
      default: MonitorIntervalScheduleOptions.WEEKLY,
    },
    dateDayOfWeek: {
      type: Number,
      enum: monitorDateDayOfWeekOptions,
      required: [true, "Please provide day of week"],
      default: MonitorDateDayOfWeekOptions.MONDAY,
    },
    dateHour: {
      type: Number,
      enum: monitorDateHourOptions,
      required: [true, "Please provide monitoring hour"],
      default: 0,
    },
    dateMinute: {
      type: Number,
      enum: monitorDateMinuteOptions,
      required: [true, "Please provide monitoring minutes"],
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

const MonitorCollection: Model<MonitorDocument> = mongoose.model(
  "Monitor",
  MonitorSchema
);

export default MonitorCollection;
