import {
  MonitorDateAMOrPMOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";

interface MonitorRequestData {
  monitorSetting: MonitorSettingOptions;
  scheduleType: MonitorScheduleTypeOptions;
  intervalSchedule: MonitorIntervalScheduleOptions;
  dateDayOfWeek: number;
  dateHour: number;
  dateMinute: number;
  dateAMOrPM: MonitorDateAMOrPMOptions;
}

interface MonitorDataResponse extends MonitorRequestData {
  _id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export { MonitorRequestData, MonitorDataResponse };
