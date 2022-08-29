import mongoose, { Schema } from "mongoose";
import { UnifiedModel } from "models/UnifiedModel";
import { ApiStatusOptions } from "enum";

export interface Api extends UnifiedModel {
  url: string;
  host: string;
  monitoring: string;
  status: ApiStatusOptions;
  lastPinged: string;
  createdBy: Schema.Types.ObjectId;
}

export default interface ApiDocument extends Api, mongoose.Document {}
