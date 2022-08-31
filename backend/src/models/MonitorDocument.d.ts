import { UnifiedModel } from "models/UnifiedModel";
import mongoose from "mongoose";

export interface Monitor extends UnifiedModel {
  useInterval: boolean;
  useDate: boolean;
  intervalSchedule: string;
  dateDayOfWeek: number;
  dateHour: number;
  dateMinute: number;
  createdBy: mongoose.Types.ObjectId;
}

export default interface MonitorDocument extends Monitor, mongoose.Document {}
