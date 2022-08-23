import mongoose, { Model, Schema } from "mongoose";
import ApiDocument from "models/ApiDocument";

const ApiSchema: Schema<ApiDocument> = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Please provide API URL"],
    },
    host: {
      type: String,
      enum: ["AWS", "GCP", "Azure", "Heroku", "DigitalOcean", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["healthy", "unhealthy", "pending"],
      default: "pending",
    },
    lastPinged: {
      type: String,
      required: [true, "Please provide last ping date and time"],
      default: "Never pinged",
    },
    monitoring: {
      type: String,
      enum: ["on", "off"],
      default: "off",
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
