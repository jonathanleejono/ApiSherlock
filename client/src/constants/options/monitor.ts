import {
  MonitorDateAMOrPMOptions,
  MonitorDateDayOfWeekOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { MonitorRequestData } from "interfaces/monitor";

const mockMonitor: MonitorRequestData = {
  monitorSetting: MonitorSettingOptions.OFF,
  scheduleType: MonitorScheduleTypeOptions.INTERVAL,
  intervalSchedule: MonitorIntervalScheduleOptions.WEEKLY,
  dateDayOfWeek: 0,
  dateHour: 0,
  dateMinute: 0,
  dateAMOrPM: MonitorDateAMOrPMOptions.AM,
};

export const validCreateMonitorKeys = Object.keys(mockMonitor);

export const validUpdateMonitorKeys = validCreateMonitorKeys;

export const validMonitorSettingOptions = Object.values(
  MonitorSettingOptions
).reverse();

export const validMonitorScheduleTypeOptions = Object.values(
  MonitorScheduleTypeOptions
);

export const validMonitorIntervalScheduleOptions = Object.values(
  MonitorIntervalScheduleOptions
);

// array goes from 1 to 12
// the selected number gets handled before submitted to cron
// (eg. 12AM gets subtracted by 12 to make it the 0 hour)
export const validMonitorDateHourOptions = [...Array(13).keys()].slice(1);

// array goes from 0 to 59
export const validMonitorDateMinuteOptions = Array.from(
  { length: 60 },
  (_, i) => i
);

export const validMonitorDateAMorPMOptions = Object.values(
  MonitorDateAMOrPMOptions
);

// goes from 0 to 6
const days = Array.from({ length: 7 }, (_, i) => i);

export function getEnumDay<T>(type: T, day: number): T[keyof T] {
  const casted = day as keyof T;
  return type[casted];
}

// gives the string value for each key in enum
// this is different than the backend
export const validMonitorDateDayOfWeekOptions: MonitorDateDayOfWeekOptions[] =
  [];

Object.values(days).forEach((day) =>
  validMonitorDateDayOfWeekOptions.push(
    getEnumDay(MonitorDateDayOfWeekOptions, day)
  )
);
