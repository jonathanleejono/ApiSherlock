"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCronUTCTime = void 0;
async function getCronUTCTime({ timezone, inputDay, inputHour, inputMinute, }) {
    if (timezone < 0) {
        const diffHour = inputHour - timezone;
        if (diffHour >= 24) {
            const UTCDay = inputDay + 1;
            const UTCHour = diffHour - 24;
            return `* ${inputMinute} ${UTCHour} * * ${UTCDay}`;
        }
        else {
            return `* ${inputMinute} ${diffHour} * * ${inputDay}`;
        }
    }
    else if (timezone > 0) {
        const diffHour = inputHour - timezone;
        if (diffHour <= 0) {
            const UTCDay = inputDay - 1;
            const UTCHour = diffHour + 24;
            return `* ${inputMinute} ${UTCHour} * * ${UTCDay}`;
        }
        else {
            return `* ${inputMinute} ${diffHour} * * ${inputDay}`;
        }
    }
    else {
        return `* ${inputMinute} ${inputHour} * * ${inputDay}`;
    }
}
exports.getCronUTCTime = getCronUTCTime;
//# sourceMappingURL=getCronUTCTime.js.map