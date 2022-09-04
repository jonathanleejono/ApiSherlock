import {
  MonitorDateAMOrPMOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { UnifiedModel } from "models/UnifiedModel";
import mongoose from "mongoose";

export interface Monitor extends UnifiedModel {
  monitorSetting: MonitorSettingOptions;
  scheduleType: MonitorScheduleTypeOptions;
  intervalSchedule: MonitorIntervalScheduleOptions;
  dateDayOfWeek: number;
  dateHour: number;
  dateMinute: number;
  dateAMOrPM: MonitorDateAMOrPMOptions;
  createdBy: mongoose.Types.ObjectId;
}

export default interface MonitorDocument extends Monitor, mongoose.Document {}
