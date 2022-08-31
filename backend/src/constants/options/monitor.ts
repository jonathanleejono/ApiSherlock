import { MonitorIntervalScheduleOptions } from "enum/monitor";
import { mockMonitor } from "mocks/mockMonitor";

export const validCreateMonitorKeys = Object.keys(mockMonitor);

export const validUpdateMonitorKeys = validCreateMonitorKeys;

export const validMonitorIntervalScheduleOptions = Object.values(
  MonitorIntervalScheduleOptions
);

// array goes up till 7, so last value is 6
export const validMonitorDateDayOfWeekOptions = Array.from(
  { length: 7 },
  (_, i) => i
);

// array goes up until 24, so last value is 23
export const validMonitorDateHourOptions = Array.from(
  { length: 24 },
  (_, i) => i
);

export const validMonitorDateMinuteOptions = Array.from(
  { length: 60 },
  (_, i) => i
);
