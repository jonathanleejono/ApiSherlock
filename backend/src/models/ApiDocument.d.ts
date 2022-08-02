import mongoose from "mongoose";
import { UnifiedModel } from "UnifiedModel";

export interface Api extends UnifiedModel {
  url: string;
  host: string;
  status: string;
  lastPinged: string;
  monitoring: string;
  createdBy: mongoose.Types.ObjectId;
}

export default interface ApiDocument extends Api, mongoose.Document {}
