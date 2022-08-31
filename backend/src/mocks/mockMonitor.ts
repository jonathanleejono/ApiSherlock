import { MonitorIntervalScheduleOptions } from "enum/monitor";
import { Monitor } from "models/MonitorDocument";

export const mockMonitor: Omit<Monitor, "_id" | "createdBy"> = {
  useInterval: true,
  intervalSchedule: MonitorIntervalScheduleOptions.WEEKLY,
  useDate: false,
  dateDayOfWeek: 0,
  dateHour: 0,
  dateMinute: 0,
};
