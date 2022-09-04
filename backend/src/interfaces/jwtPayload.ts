import { Schema } from "mongoose";

export interface JwtPayload {
  userId: Schema.Types.ObjectId;
}
