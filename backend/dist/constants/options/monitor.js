"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringDaysOptions = exports.getEnumDay = exports.validMonitorDateDayOfWeekOptions = exports.validMonitorDateAMorPMOptions = exports.validMonitorDateMinuteOptions = exports.validMonitorDateHourOptions = exports.validMonitorScheduleTypeOptions = exports.validMonitorIntervalScheduleOptions = exports.validMonitorSettingOptions = exports.validUpdateMonitorKeys = exports.validCreateMonitorKeys = void 0;
const monitor_1 = require("enum/monitor");
const mockMonitor_1 = require("mocks/mockMonitor");
exports.validCreateMonitorKeys = Object.keys(mockMonitor_1.mockMonitor);
exports.validUpdateMonitorKeys = exports.validCreateMonitorKeys;
exports.validMonitorSettingOptions = Object.values(monitor_1.MonitorSettingOptions);
exports.validMonitorIntervalScheduleOptions = Object.values(monitor_1.MonitorIntervalScheduleOptions);
exports.validMonitorScheduleTypeOptions = Object.values(monitor_1.MonitorScheduleTypeOptions);
exports.validMonitorDateHourOptions = [...Array(13).keys()].slice(1);
exports.validMonitorDateMinuteOptions = Array.from({ length: 60 }, (_, i) => i);
exports.validMonitorDateAMorPMOptions = Object.values(monitor_1.MonitorDateAMOrPMOptions);
exports.validMonitorDateDayOfWeekOptions = Array.from({ length: 7 }, (_, i) => i);
function getEnumDay(type, day) {
    const casted = day;
    return type[casted];
}
exports.getEnumDay = getEnumDay;
exports.stringDaysOptions = [];
Object.values(exports.validMonitorDateDayOfWeekOptions).forEach((day) => exports.stringDaysOptions.push(getEnumDay(monitor_1.MonitorDateDayOfWeekOptions, day)));
//# sourceMappingURL=monitor.js.map