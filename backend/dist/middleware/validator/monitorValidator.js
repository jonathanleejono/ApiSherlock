"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorValidator = void 0;
const monitor_1 = require("constants/options/monitor");
const express_validator_1 = require("express-validator");
const validateKeysValues_1 = require("utils/validateKeysValues");
function monitorValidator({ create }) {
    if (create === true) {
        return [
            (0, express_validator_1.body)("monitorSetting")
                .isIn(monitor_1.validMonitorSettingOptions)
                .withMessage(`Invalid monitor setting, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorSettingOptions)} `),
            (0, express_validator_1.body)("scheduleType")
                .isIn(monitor_1.validMonitorScheduleTypeOptions)
                .withMessage(`Invalid schedule type, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorScheduleTypeOptions)} `),
            (0, express_validator_1.body)("intervalSchedule")
                .isIn(monitor_1.validMonitorIntervalScheduleOptions)
                .withMessage(`Invalid interval schedule, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorIntervalScheduleOptions)} `),
            (0, express_validator_1.body)("dateDayOfWeek")
                .isIn(monitor_1.validMonitorDateDayOfWeekOptions)
                .withMessage(`Invalid day of week, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.stringDaysOptions)} `),
            (0, express_validator_1.body)("dateHour")
                .isIn(monitor_1.validMonitorDateHourOptions)
                .withMessage(`Invalid hour, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorDateHourOptions)} `),
            (0, express_validator_1.body)("dateMinute")
                .isIn(monitor_1.validMonitorDateMinuteOptions)
                .withMessage(`Invalid minute, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorDateMinuteOptions)} `),
            (0, express_validator_1.body)("dateAMOrPM")
                .isIn(monitor_1.validMonitorDateAMorPMOptions)
                .withMessage(`Invalid AM or PM setting, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorDateAMorPMOptions)} `),
        ];
    }
    return [
        (0, express_validator_1.body)("monitorSetting")
            .optional()
            .isIn(monitor_1.validMonitorSettingOptions)
            .withMessage(`Invalid monitor setting, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorSettingOptions)} `),
        (0, express_validator_1.body)("scheduleType")
            .optional()
            .isIn(monitor_1.validMonitorScheduleTypeOptions)
            .withMessage(`Invalid schedule type, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorScheduleTypeOptions)} `),
        (0, express_validator_1.body)("intervalSchedule")
            .optional()
            .isIn(monitor_1.validMonitorIntervalScheduleOptions)
            .withMessage(`Invalid interval schedule, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorIntervalScheduleOptions)} `),
        (0, express_validator_1.body)("dateDayOfWeek")
            .optional()
            .isIn(monitor_1.validMonitorDateDayOfWeekOptions)
            .withMessage(`Invalid day of week, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.stringDaysOptions)} `),
        (0, express_validator_1.body)("dateHour")
            .optional()
            .isIn(monitor_1.validMonitorDateHourOptions)
            .withMessage(`Invalid hour, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorDateHourOptions)} `),
        (0, express_validator_1.body)("dateMinute")
            .optional()
            .isIn(monitor_1.validMonitorDateMinuteOptions)
            .withMessage(`Invalid minute, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorDateMinuteOptions)} `),
        (0, express_validator_1.body)("dateAMOrPM")
            .optional()
            .isIn(monitor_1.validMonitorDateAMorPMOptions)
            .withMessage(`Invalid AM or PM setting, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(monitor_1.validMonitorDateAMorPMOptions)} `),
    ];
}
exports.monitorValidator = monitorValidator;
//# sourceMappingURL=monitorValidator.js.map