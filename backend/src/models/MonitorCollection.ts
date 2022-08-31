import {
  validMonitorDateDayOfWeekOptions,
  validMonitorDateHourOptions,
  validMonitorDateMinuteOptions,
  validMonitorIntervalScheduleOptions,
} from "constants/options/monitor";
import { MonitorIntervalScheduleOptions } from "enum/monitor";
import MonitorDocument from "models/MonitorDocument";
import mongoose, { Model, Schema } from "mongoose";

const MonitorSchema: Schema<MonitorDocument> = new mongoose.Schema(
  {
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
      enum: validMonitorIntervalScheduleOptions,
      default: MonitorIntervalScheduleOptions.WEEKLY,
    },
    dateDayOfWeek: {
      type: Number,
      enum: validMonitorDateDayOfWeekOptions,
      default: 0,
    },
    dateHour: {
      type: Number,
      enum: validMonitorDateHourOptions,
      default: 0,
    },
    dateMinute: {
      type: Number,
      enum: validMonitorDateMinuteOptions,
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
