import mongoose, { Schema } from "mongoose";
import { UnifiedModel } from "models/UnifiedModel";

export interface Api extends UnifiedModel {
  url: string;
  host: string;
  monitoring: string;
  status: string;
  lastPinged: string;
  createdBy: Schema.Types.ObjectId;
}

export default interface ApiDocument extends Api, mongoose.Document {}
