import { Schema } from "mongoose";

export interface UnifiedModel {
  _id: Types.ObjectId; // This _id should be readonly on client side
  readonly createdAt?: string;
  readonly updatedAt?: string;
}
