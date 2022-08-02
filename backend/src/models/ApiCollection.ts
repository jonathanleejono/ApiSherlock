import mongoose, { Model } from "mongoose";
import ApiDocument from "models/ApiDocument";

const ApiSchema = new mongoose.Schema(
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
      type: mongoose.Types.ObjectId,
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
