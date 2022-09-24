import {
  stringDaysOptions,
  validMonitorDateAMorPMOptions,
  validMonitorDateDayOfWeekOptions,
  validMonitorDateHourOptions,
  validMonitorDateMinuteOptions,
  validMonitorIntervalScheduleOptions,
  validMonitorScheduleTypeOptions,
  validMonitorSettingOptions,
} from "constants/options/monitor";
import { body } from "express-validator";
import { validFieldsFormatted } from "utils/validateKeysValues";

export function monitorValidator({ create }: { create: boolean }) {
  if (create === true) {
    return [
      body("monitorSetting")
        .isIn(validMonitorSettingOptions)
        .withMessage(
          `Invalid monitor setting, must be one of: ${validFieldsFormatted(
            validMonitorSettingOptions
          )} `
        ),
      body("scheduleType")
        .isIn(validMonitorScheduleTypeOptions)
        .withMessage(
          `Invalid schedule type, must be one of: ${validFieldsFormatted(
            validMonitorScheduleTypeOptions
          )} `
        ),
      body("intervalSchedule")
        .isIn(validMonitorIntervalScheduleOptions)
        .withMessage(
          `Invalid interval schedule, must be one of: ${validFieldsFormatted(
            validMonitorIntervalScheduleOptions
          )} `
        ),
      body("dateDayOfWeek")
        .isIn(validMonitorDateDayOfWeekOptions)
        .withMessage(
          // using stringDays because valid options are integers
          `Invalid day of week, must be one of: ${validFieldsFormatted(
            stringDaysOptions
          )} `
        ),
      body("dateHour")
        .isIn(validMonitorDateHourOptions)
        .withMessage(
          `Invalid hour, must be one of: ${validFieldsFormatted(
            validMonitorDateHourOptions
          )} `
        ),
      body("dateMinute")
        .isIn(validMonitorDateMinuteOptions)
        .withMessage(
          `Invalid minute, must be one of: ${validFieldsFormatted(
            validMonitorDateMinuteOptions
          )} `
        ),
      body("dateAMOrPM")
        .isIn(validMonitorDateAMorPMOptions)
        .withMessage(
          `Invalid AM or PM setting, must be one of: ${validFieldsFormatted(
            validMonitorDateAMorPMOptions
          )} `
        ),
    ];
  }

  return [
    body("monitorSetting")
      .optional()
      .isIn(validMonitorSettingOptions)
      .withMessage(
        `Invalid monitor setting, must be one of: ${validFieldsFormatted(
          validMonitorSettingOptions
        )} `
      ),
    body("scheduleType")
      .optional()
      .isIn(validMonitorScheduleTypeOptions)
      .withMessage(
        `Invalid schedule type, must be one of: ${validFieldsFormatted(
          validMonitorScheduleTypeOptions
        )} `
      ),
    body("intervalSchedule")
      .optional()
      .isIn(validMonitorIntervalScheduleOptions)
      .withMessage(
        `Invalid interval schedule, must be one of: ${validFieldsFormatted(
          validMonitorIntervalScheduleOptions
        )} `
      ),
    body("dateDayOfWeek")
      .optional()
      .isIn(validMonitorDateDayOfWeekOptions)
      .withMessage(
        // using stringDays because valid options are integers
        `Invalid day of week, must be one of: ${validFieldsFormatted(
          stringDaysOptions
        )} `
      ),
    body("dateHour")
      .optional()
      .isIn(validMonitorDateHourOptions)
      .withMessage(
        `Invalid hour, must be one of: ${validFieldsFormatted(
          validMonitorDateHourOptions
        )} `
      ),
    body("dateMinute")
      .optional()
      .isIn(validMonitorDateMinuteOptions)
      .withMessage(
        `Invalid minute, must be one of: ${validFieldsFormatted(
          validMonitorDateMinuteOptions
        )} `
      ),
    body("dateAMOrPM")
      .optional()
      .isIn(validMonitorDateAMorPMOptions)
      .withMessage(
        `Invalid AM or PM setting, must be one of: ${validFieldsFormatted(
          validMonitorDateAMorPMOptions
        )} `
      ),
  ];
}
