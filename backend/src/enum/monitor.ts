export enum MonitorIntervalScheduleOptions {
  WEEKLY = "weekly",
  DAILY = "daily",
  HOURLY = "hourly",
  MINUTES = "minutes",
}

export const monitorIntervalScheduleOptions = [
  MonitorIntervalScheduleOptions.WEEKLY,
  MonitorIntervalScheduleOptions.DAILY,
  MonitorIntervalScheduleOptions.HOURLY,
  MonitorIntervalScheduleOptions.MINUTES,
];

export enum MonitorDateDayOfWeekOptions {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export const monitorDateDayOfWeekOptions = [
  MonitorDateDayOfWeekOptions.SUNDAY,
  MonitorDateDayOfWeekOptions.MONDAY,
  MonitorDateDayOfWeekOptions.TUESDAY,
  MonitorDateDayOfWeekOptions.WEDNESDAY,
  MonitorDateDayOfWeekOptions.THURSDAY,
  MonitorDateDayOfWeekOptions.FRIDAY,
  MonitorDateDayOfWeekOptions.SATURDAY,
];
