import { ObjectId } from "mongoose";

export interface UnifiedModel {
  _id: ObjectId; // This _id should be readonly on client side
  readonly createdAt?: string;
  readonly updatedAt?: string;
}
