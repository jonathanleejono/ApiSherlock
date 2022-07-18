import mongoose, { Model, Schema, model } from "mongoose";
import MonitorDocument from "./MonitorDocument";

const MonitorSchema: Schema = new mongoose.Schema(
  {
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
    time: {
      type: String,
      required: [true, "Please provide monitoring time"],
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
      default: "monday",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);
// const MonitorCollection: Model<MonitorDocument>

const MonitorCollection: Model<MonitorDocument> = mongoose.model(
  "Monitor",
  MonitorSchema
);

export default MonitorCollection;
