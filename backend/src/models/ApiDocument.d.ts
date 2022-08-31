import mongoose, { Schema } from "mongoose";
import { UnifiedModel } from "models/UnifiedModel";
import { ApiStatusOptions } from "enum";
import { ApiHostOptions } from "enum/apis";

export interface Api extends UnifiedModel {
  url: string;
  host: ApiHostOptions;
  monitoring: ApiMonitoringOptions;
  status: ApiStatusOptions;
  lastPinged: string;
  createdBy: Schema.Types.ObjectId;
}

export default interface ApiDocument extends Api, mongoose.Document {}
