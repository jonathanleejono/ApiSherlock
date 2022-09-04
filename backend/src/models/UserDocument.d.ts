import mongoose from "mongoose";
import { UnifiedModel } from "models/UnifiedModel";

export type ComparePasswordFunction = (
  inputPassword: string,
  dbPassword: string
) => Promise<boolean>;

export type CreateJWTFunction = (jwtExpirationTime: string) => string;

export interface User extends UnifiedModel {
  name: string;
  email: string;
  password: string;
  timezoneGMT: number;
}

export default interface UserDocument extends User, mongoose.Document {
  comparePassword: ComparePasswordFunction;
  createJWT: CreateJWTFunction;
}
