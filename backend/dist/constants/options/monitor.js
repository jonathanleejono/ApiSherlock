"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validMonitorDateMinuteOptions = exports.validMonitorDateHourOptions = exports.validMonitorDateDayOfWeekOptions = exports.validMonitorIntervalScheduleOptions = exports.validUpdateMonitorKeys = exports.validCreateMonitorKeys = void 0;
const monitor_1 = require("enum/monitor");
const mockMonitor_1 = require("mocks/mockMonitor");
exports.validCreateMonitorKeys = Object.keys(mockMonitor_1.mockMonitor);
exports.validUpdateMonitorKeys = exports.validCreateMonitorKeys;
exports.validMonitorIntervalScheduleOptions = Object.values(monitor_1.MonitorIntervalScheduleOptions);
exports.validMonitorDateDayOfWeekOptions = Array.from({ length: 7 }, (_, i) => i);
exports.validMonitorDateHourOptions = Array.from({ length: 24 }, (_, i) => i);
exports.validMonitorDateMinuteOptions = Array.from({ length: 60 }, (_, i) => i);
//# sourceMappingURL=monitor.js.map