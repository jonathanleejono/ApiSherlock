"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrentMonthYear = exports.getDateWithUTCOffset = void 0;
function getDateWithUTCOffset(userTimezone, showTime = true) {
    try {
        const currentServerDateTime = Date.now();
        const localServerTimeDiffWithUTC = new Date().getTimezoneOffset() * 1000 * 60;
        const timezoneOffset = 1000 * 60 * 60 * userTimezone;
        const currentDateTimeAdjusted = currentServerDateTime + localServerTimeDiffWithUTC + timezoneOffset;
        const formattedDateTime = new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: showTime ? "medium" : undefined,
        }).format(currentDateTimeAdjusted);
        return `${formattedDateTime} (GMT ${userTimezone})`;
    }
    catch (error) {
        console.error("Error getting date: ", error);
        return "Error getting date";
    }
}
exports.getDateWithUTCOffset = getDateWithUTCOffset;
function formatCurrentMonthYear(year, month) {
    const newDate = new Date(Date.UTC(year, month));
    const date = new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
    }).format(newDate);
    return date;
}
exports.formatCurrentMonthYear = formatCurrentMonthYear;
//# sourceMappingURL=datetime.js.map