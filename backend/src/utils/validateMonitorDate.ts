import {
  validMonitorDateDayOfWeekOptions,
  validMonitorDateHourOptions,
  validMonitorDateMinuteOptions,
} from "constants/options/monitor";
import { Response } from "express";
import { validValues } from "utils/validateKeysValues";

export function validMonitorDate(
  res: Response,
  dateDayOfWeek: number,
  dateHour: number,
  dateMinute: number
): boolean {
  if (
    !validValues(
      res,
      dateDayOfWeek,
      `Invalid day of week, please select one of: `,
      validMonitorDateDayOfWeekOptions
    )
  )
    return false;

  if (
    !validValues(
      res,
      dateHour,
      `Invalid hour, please select one of: `,
      validMonitorDateHourOptions
    )
  )
    return false;

  if (
    !validValues(
      res,
      dateMinute,
      `Invalid minutes, please select one of: `,
      validMonitorDateMinuteOptions
    )
  )
    return false;

  return true;
}
