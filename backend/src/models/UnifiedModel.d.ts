import { ObjectId } from "mongoose";

export interface UnifiedModel {
  readonly _id: ObjectId; // make sure this is Schema.Types.ObjectId
  readonly createdAt?: string;
  readonly updatedAt?: string;
}
