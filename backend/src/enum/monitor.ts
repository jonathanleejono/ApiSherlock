export enum MonitorIntervalScheduleOptions {
  WEEKLY = "weekly",
  DAILY = "daily",
  HOURLY = "hourly",
  MINUTES = "minutes",
}

/* 
using enum like this doesn't work 
because Object.values() treats the actual days
as string values AND includes number values 
for the integer days
*/
// export enum MonitorDateDayOfWeekOptions {
//   SUNDAY = 0,
//   MONDAY = 1,
//   TUESDAY = 2,
//   WEDNESDAY = 3,
//   THURSDAY = 4,
//   FRIDAY = 5,
//   SATURDAY = 6,
// }
