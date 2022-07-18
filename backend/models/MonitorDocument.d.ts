import mongoose from "mongoose";
import { UnifiedModel } from "./UnifiedModel";

// time of ping
// day of the week (can be monday, tuesday, wed)
// if day of week is selected, can't be non-weekday timed: weekly, daily, hourly
// OR weekly, daily, hourly
// associate with user created by

// interval: true or false
// intervalSchedule: true or false

//
export interface Monitor extends UnifiedModel {
  intervalSetting: boolean;
  intervalSchedule: string; // weekly, daily, hourly
  // intervalSchedule: "weekly" | "daily" | "hourly" | "seconds" | "none"; // weekly, daily, hourly
  time: string;
  dayOfWeek: string;
  // dayOfWeek:
  //   | "monday"
  //   | "tuesday"
  //   | "wednesday"
  //   | "thursday"
  //   | "friday"
  //   | "saturday"
  //   | "sunday"
  //   | "none";
  createdBy: mongoose.Types.ObjectId;
}

export default interface MonitorDocument extends Monitor {}
