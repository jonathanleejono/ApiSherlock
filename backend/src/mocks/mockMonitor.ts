import {
  MonitorDateAMOrPMOptions,
  MonitorDateDayOfWeekOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { Monitor } from "models/MonitorDocument";

export const mockMonitor: Omit<Monitor, "_id" | "createdBy"> = {
  monitorSetting: MonitorSettingOptions.OFF,
  scheduleType: MonitorScheduleTypeOptions.INTERVAL,
  intervalSchedule: MonitorIntervalScheduleOptions.HOURLY,
  dateDayOfWeek: MonitorDateDayOfWeekOptions.Sunday,
  dateHour: 1,
  dateMinute: 0,
  dateAMOrPM: MonitorDateAMOrPMOptions.AM,
};
