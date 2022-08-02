import mongoose from "mongoose";
import { UnifiedModel } from "UnifiedModel";

export type ComparePasswordFunction = (
  inputPassword: string,
  dbPassword: string
) => Promise<boolean>;

export type CreateJWTFunction = () => string;

export interface User extends UnifiedModel {
  name: string;
  email: string;
  password: string;
}

export default interface UserDocument extends User, mongoose.Document {
  comparePassword: ComparePasswordFunction;
  createJWT: CreateJWTFunction;
}
