import { Schema } from "mongoose";

export interface ApiQueryParams {
  createdBy: Schema.Types.ObjectId;
  host?: string;
  status?: string;
  monitoring?: string;
  url?: { $regex: string; $options: string };
}
