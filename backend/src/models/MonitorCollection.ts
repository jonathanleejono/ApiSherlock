import {
  validMonitorDateAMorPMOptions,
  validMonitorDateDayOfWeekOptions,
  validMonitorDateHourOptions,
  validMonitorDateMinuteOptions,
  validMonitorIntervalScheduleOptions,
} from "constants/options/monitor";
import {
  MonitorDateAMOrPMOptions,
  MonitorDateDayOfWeekOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import MonitorDocument from "models/MonitorDocument";
import mongoose, { Model, Schema } from "mongoose";

const MonitorSchema: Schema<MonitorDocument> = new mongoose.Schema(
  {
    monitorSetting: {
      type: String,
      required: [true, "Please specify if monitor is on or off"],
      default: MonitorSettingOptions.OFF,
    },
    scheduleType: {
      type: String,
      required: [true, "Please specify schedule type"],
      default: MonitorScheduleTypeOptions.INTERVAL,
    },
    intervalSchedule: {
      type: String,
      enum: validMonitorIntervalScheduleOptions,
      default: MonitorIntervalScheduleOptions.WEEKLY,
    },
    dateDayOfWeek: {
      type: Number,
      enum: validMonitorDateDayOfWeekOptions,
      default: MonitorDateDayOfWeekOptions.Sunday,
    },
    dateHour: {
      type: Number,
      enum: validMonitorDateHourOptions,
      default: 12,
    },
    dateMinute: {
      type: Number,
      enum: validMonitorDateMinuteOptions,
      default: 0,
    },
    dateAMOrPM: {
      type: String,
      enum: validMonitorDateAMorPMOptions,
      default: MonitorDateAMOrPMOptions.AM,
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
