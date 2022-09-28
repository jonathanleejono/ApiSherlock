"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueHour = void 0;
const monitor_1 = require("enum/monitor");
function getQueueHour(dateHour, dateAMOrPM) {
    let hour = dateHour;
    if (dateHour === 12 && dateAMOrPM === monitor_1.MonitorDateAMOrPMOptions.AM) {
        hour = dateHour - 12;
    }
    if (dateHour !== 12 && dateAMOrPM === monitor_1.MonitorDateAMOrPMOptions.PM) {
        hour = dateHour + 12;
    }
    if (dateHour === 12 && dateAMOrPM === monitor_1.MonitorDateAMOrPMOptions.PM) {
        hour = dateHour;
    }
    return hour;
}
exports.getQueueHour = getQueueHour;
//# sourceMappingURL=getQueueHour.js.map