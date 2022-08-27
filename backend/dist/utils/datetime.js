"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrentMonthYear = exports.getDateWithUTCOffset = void 0;
function getDateWithUTCOffset(offset, showTime = true) {
    try {
        const currentDateTime = Date.now() +
            new Date().getTimezoneOffset() * 1000 * 60 +
            1000 * 60 * 60 * offset;
        const formattedDateTime = new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: showTime ? "medium" : undefined,
        }).format(currentDateTime);
        return `${formattedDateTime} (GMT ${offset})`;
    }
    catch (error) {
        console.error("Error getting date: ", error);
        return;
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