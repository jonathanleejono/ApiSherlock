"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validMonitorDate = void 0;
const monitor_1 = require("constants/options/monitor");
const validateKeysValues_1 = require("utils/validateKeysValues");
function validMonitorDate(res, dateDayOfWeek, dateHour, dateMinute, dateAMOrPM) {
    if (!(0, validateKeysValues_1.validValues)(res, dateDayOfWeek, `Invalid day of week, please select one of: `, monitor_1.validMonitorDateDayOfWeekOptions, monitor_1.stringDaysOptions)) {
        return false;
    }
    if (!(0, validateKeysValues_1.validValues)(res, dateHour, `Invalid hour, please select one of: `, monitor_1.validMonitorDateHourOptions))
        return false;
    if (!(0, validateKeysValues_1.validValues)(res, dateMinute, `Invalid minutes, please select one of: `, monitor_1.validMonitorDateMinuteOptions))
        return false;
    if (!(0, validateKeysValues_1.validValues)(res, dateAMOrPM, `Invalid, please select one of: `, monitor_1.validMonitorDateAMorPMOptions))
        return false;
    return true;
}
exports.validMonitorDate = validMonitorDate;
//# sourceMappingURL=validateMonitorDate.js.map