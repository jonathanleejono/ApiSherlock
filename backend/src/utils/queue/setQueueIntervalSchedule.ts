import { setRepeatOptions } from "constants/queue";
import { MonitorIntervalScheduleOptions } from "enum/monitor";

// limit 2 means repeats twice in the entire lifespan and stop,
// which is different from limit 2 with pattern/cron
// (eg. repeat once at hour 1, repeat twice at hour 2, and then stop)
export function setQueueIntervalSchedule(intervalSchedule: string) {
  switch (intervalSchedule) {
    case MonitorIntervalScheduleOptions.WEEKLY:
      setRepeatOptions({
        every: 1000 * 60 * 60 * 24 * 7,
        limit: 2,
      });
      break;
    case MonitorIntervalScheduleOptions.DAILY:
      setRepeatOptions({
        every: 1000 * 60 * 60 * 24,
        limit: 2,
      });
      break;
    case MonitorIntervalScheduleOptions.HOURLY:
      setRepeatOptions({
        every: 1000 * 60 * 60,
        limit: 2,
      });
      break;
    case MonitorIntervalScheduleOptions.MINUTES:
      setRepeatOptions({
        every: 1000 * 60,
        limit: 2,
      });
      break;
    default:
      setRepeatOptions({
        every: 1000 * 60 * 60 * 24,
        limit: 2,
      });
  }
}
