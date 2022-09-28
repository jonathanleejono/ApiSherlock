"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setQueueIntervalSchedule = void 0;
const queue_1 = require("constants/queue");
const monitor_1 = require("enum/monitor");
function setQueueIntervalSchedule(intervalSchedule) {
    switch (intervalSchedule) {
        case monitor_1.MonitorIntervalScheduleOptions.WEEKLY:
            (0, queue_1.setRepeatOptions)({
                every: 1000 * 60 * 60 * 24 * 7,
                limit: 2,
            });
            break;
        case monitor_1.MonitorIntervalScheduleOptions.DAILY:
            (0, queue_1.setRepeatOptions)({
                every: 1000 * 60 * 60 * 24,
                limit: 2,
            });
            break;
        case monitor_1.MonitorIntervalScheduleOptions.HOURLY:
            (0, queue_1.setRepeatOptions)({
                every: 1000 * 60 * 60,
                limit: 2,
            });
            break;
        case monitor_1.MonitorIntervalScheduleOptions.MINUTES:
            (0, queue_1.setRepeatOptions)({
                every: 1000 * 60,
                limit: 2,
            });
            break;
        default:
            (0, queue_1.setRepeatOptions)({
                every: 1000 * 60 * 60 * 24,
                limit: 2,
            });
    }
}
exports.setQueueIntervalSchedule = setQueueIntervalSchedule;
//# sourceMappingURL=setQueueIntervalSchedule.js.map