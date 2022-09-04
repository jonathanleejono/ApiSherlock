"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorDateDayOfWeekOptions = exports.MonitorSettingOptions = exports.MonitorDateAMOrPMOptions = exports.MonitorScheduleTypeOptions = exports.MonitorIntervalScheduleOptions = void 0;
var MonitorIntervalScheduleOptions;
(function (MonitorIntervalScheduleOptions) {
    MonitorIntervalScheduleOptions["WEEKLY"] = "weekly";
    MonitorIntervalScheduleOptions["DAILY"] = "daily";
    MonitorIntervalScheduleOptions["HOURLY"] = "hourly";
    MonitorIntervalScheduleOptions["MINUTES"] = "minutes";
})(MonitorIntervalScheduleOptions = exports.MonitorIntervalScheduleOptions || (exports.MonitorIntervalScheduleOptions = {}));
var MonitorScheduleTypeOptions;
(function (MonitorScheduleTypeOptions) {
    MonitorScheduleTypeOptions["INTERVAL"] = "Interval";
    MonitorScheduleTypeOptions["DATE"] = "Date";
})(MonitorScheduleTypeOptions = exports.MonitorScheduleTypeOptions || (exports.MonitorScheduleTypeOptions = {}));
var MonitorDateAMOrPMOptions;
(function (MonitorDateAMOrPMOptions) {
    MonitorDateAMOrPMOptions["AM"] = "AM";
    MonitorDateAMOrPMOptions["PM"] = "PM";
})(MonitorDateAMOrPMOptions = exports.MonitorDateAMOrPMOptions || (exports.MonitorDateAMOrPMOptions = {}));
var MonitorSettingOptions;
(function (MonitorSettingOptions) {
    MonitorSettingOptions["ON"] = "ON";
    MonitorSettingOptions["OFF"] = "OFF";
})(MonitorSettingOptions = exports.MonitorSettingOptions || (exports.MonitorSettingOptions = {}));
var MonitorDateDayOfWeekOptions;
(function (MonitorDateDayOfWeekOptions) {
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["Sunday"] = 0] = "Sunday";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["Monday"] = 1] = "Monday";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["Tuesday"] = 2] = "Tuesday";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["Wednesday"] = 3] = "Wednesday";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["Thursday"] = 4] = "Thursday";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["Friday"] = 5] = "Friday";
    MonitorDateDayOfWeekOptions[MonitorDateDayOfWeekOptions["Saturday"] = 6] = "Saturday";
})(MonitorDateDayOfWeekOptions = exports.MonitorDateDayOfWeekOptions || (exports.MonitorDateDayOfWeekOptions = {}));
//# sourceMappingURL=monitor.js.map