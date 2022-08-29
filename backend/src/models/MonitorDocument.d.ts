import { MonitorDateDayOfWeekOptions } from "enum";
import { MonitorIntervalScheduleOptions } from "enum";
import mongoose from "mongoose";
import { UnifiedModel } from "models/UnifiedModel";

// time of ping
// day of the week (can be monday, tuesday, wed)
// if day of week is selected, can't be non-weekday timed: weekly, daily, hourly
// OR weekly, daily, hourly
// associate with user created by

export interface Monitor extends UnifiedModel {
  monitoringOn: boolean;
  useInterval: boolean;
  useDate: boolean;
  intervalSchedule: string;
  dateDayOfWeek: number;
  dateHour: number;
  dateMinute: number;
  createdBy: mongoose.Types.ObjectId;
}

export default interface MonitorDocument extends Monitor, mongoose.Document {}
