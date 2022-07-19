import mongoose, { Model, Schema, model } from "mongoose";
import MonitorDocument from "./MonitorDocument";

const MonitorSchema: Schema = new mongoose.Schema(
  {
    setting: {
      type: Boolean,
      required: [true, "Please provide monitoring setting"],
    },
    intervalSetting: {
      type: Boolean,
      required: [true, "Please provide interval setting"],
    },
    intervalSchedule: {
      type: String,
      enum: ["weekly", "daily", "hourly", "seconds", "none"],
      required: [true, "Please provide interval schedule"],
      default: "weekly",
    },
    timeHour: {
      type: Number,
      required: [true, "Please provide monitoring hour"],
    },
    timeMinutes: {
      type: Number,
      required: [true, "Please provide monitoring minutes"],
    },
    timeAMOrPM: {
      type: String,
      enum: ["AM", "PM"],
      required: [true, "Please provide AM or PM time"],
      default: "AM",
    },
    dayOfWeek: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
        "none",
      ],
      required: [true, "Please provide monitoring day"],
      default: "none",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
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
