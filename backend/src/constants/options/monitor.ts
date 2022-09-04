import {
  MonitorDateAMOrPMOptions,
  MonitorDateDayOfWeekOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import { mockMonitor } from "mocks/mockMonitor";

export const validCreateMonitorKeys = Object.keys(mockMonitor);

export const validUpdateMonitorKeys = validCreateMonitorKeys;

export const validMonitorSettingOptions = Object.values(MonitorSettingOptions);

export const validMonitorIntervalScheduleOptions = Object.values(
  MonitorIntervalScheduleOptions
);

export const validMonitorScheduleTypeOptions = Object.values(
  MonitorScheduleTypeOptions
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
// frontend options are different
export const validMonitorDateDayOfWeekOptions = Array.from(
  { length: 7 },
  (_, i) => i
);

export function getEnumDay<T>(type: T, day: number): T[keyof T] {
  const casted = day as keyof T;
  return type[casted];
}

// gives the string value for each key in enum
// this is used to display valid options for the frontend
// this is only used in utils/validMonitorDate
export const stringDaysOptions: MonitorDateDayOfWeekOptions[] = [];

Object.values(validMonitorDateDayOfWeekOptions).forEach((day) =>
  stringDaysOptions.push(getEnumDay(MonitorDateDayOfWeekOptions, day))
);
