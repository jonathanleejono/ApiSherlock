import { Monitor } from "models/MonitorDocument";

export const mockMonitor: Omit<Monitor, "_id" | "createdBy"> = {
  useInterval: false,
  useDate: false,
  intervalSchedule: "",
  dateDayOfWeek: 0,
  dateHour: 0,
  dateMinute: 0,
};
