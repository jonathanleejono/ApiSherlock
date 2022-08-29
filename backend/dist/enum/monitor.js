"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorDateDayOfWeekOptions = exports.MonitorDateDayOfWeekOptions = exports.monitorIntervalScheduleOptions = exports.MonitorIntervalScheduleOptions = void 0;
var MonitorIntervalScheduleOptions;
(function (MonitorIntervalScheduleOptions) {
    MonitorIntervalScheduleOptions["WEEKLY"] = "weekly";
    MonitorIntervalScheduleOptions["DAILY"] = "daily";
    MonitorIntervalScheduleOptions["HOURLY"] = "hourly";
    MonitorIntervalScheduleOptions["MINUTES"] = "minutes";
})(MonitorIntervalScheduleOptions = exports.MonitorIntervalScheduleOptions || (exports.MonitorIntervalScheduleOptions = {}));
exports.monitorIntervalScheduleOptions = [
    MonitorIntervalScheduleOptions.WEEKLY,
    MonitorIntervalScheduleOptions.DAILY,
    MonitorIntervalScheduleOptions.HOURLY,
    MonitorIntervalScheduleOptions.MINUTES,
];
var MonitorDateDayOfWeekOptions;
(function (MonitorDateDayOfWeekOptions) {
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["SUNDAY"] = 0] = "SUNDAY";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["MONDAY"] = 1] = "MONDAY";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["TUESDAY"] = 2] = "TUESDAY";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["WEDNESDAY"] = 3] = "WEDNESDAY";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["THURSDAY"] = 4] = "THURSDAY";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["FRIDAY"] = 5] = "FRIDAY";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["SATURDAY"] = 6] = "SATURDAY";
})(MonitorDateDayOfWeekOptions = exports.MonitorDateDayOfWeekOptions || (exports.MonitorDateDayOfWeekOptions = {}));
exports.monitorDateDayOfWeekOptions = [
    MonitorDateDayOfWeekOptions.SUNDAY,
    MonitorDateDayOfWeekOptions.MONDAY,
    MonitorDateDayOfWeekOptions.TUESDAY,
    MonitorDateDayOfWeekOptions.WEDNESDAY,
    MonitorDateDayOfWeekOptions.THURSDAY,
    MonitorDateDayOfWeekOptions.FRIDAY,
    MonitorDateDayOfWeekOptions.SATURDAY,
];
//# sourceMappingURL=monitor.js.map