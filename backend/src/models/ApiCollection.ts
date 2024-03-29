import {
  validApiHostOptions,
  validApiMonitoringOptions,
  validApiStatusOptions,
} from "constants/options/apis";
import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiStatusOptions,
} from "enum/apis";
import ApiDocument from "models/ApiDocument";
import mongoose, { Model, Schema } from "mongoose";

const ApiSchema: Schema<ApiDocument> = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Please provide API URL"],
    },
    host: {
      type: String,
      enum: validApiHostOptions,
      default: ApiHostOptions.OTHER,
    },
    status: {
      type: String,
      enum: validApiStatusOptions,
      default: ApiStatusOptions.PENDING,
    },
    lastPinged: {
      type: String,
      required: [true, "Please provide last ping date and time"],
      default: "Never pinged",
    },
    monitoring: {
      type: String,
      enum: validApiMonitoringOptions,
      default: ApiMonitoringOptions.OFF,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

const ApiCollection: Model<ApiDocument> = mongoose.model(
  "ApiCollection",
  ApiSchema
);

export default ApiCollection;
