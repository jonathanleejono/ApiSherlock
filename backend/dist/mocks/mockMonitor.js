"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockMonitor = void 0;
const monitor_1 = require("enum/monitor");
exports.mockMonitor = {
    monitorSetting: monitor_1.MonitorSettingOptions.OFF,
    scheduleType: monitor_1.MonitorScheduleTypeOptions.INTERVAL,
    intervalSchedule: monitor_1.MonitorIntervalScheduleOptions.HOURLY,
    dateDayOfWeek: monitor_1.MonitorDateDayOfWeekOptions.Sunday,
    dateHour: 0,
    dateMinute: 0,
    dateAMOrPM: monitor_1.MonitorDateAMOrPMOptions.AM,
};
//# sourceMappingURL=mockMonitor.js.map