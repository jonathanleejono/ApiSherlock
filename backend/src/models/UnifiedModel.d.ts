import { Schema } from "mongoose";

export interface UnifiedModel {
  _id: Schema.Types.ObjectId;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly __v?: number;
}
