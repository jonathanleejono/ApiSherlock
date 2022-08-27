"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentMonthYear = exports.getDateWithUTCOffset = void 0;
function getDateWithUTCOffset(offset, showTime = true) {
    const currentDateTime = Date.now() +
        new Date().getTimezoneOffset() * 1000 * 60 +
        1000 * 60 * 60 * offset;
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: showTime ? "medium" : undefined,
    }).format(currentDateTime);
    return `${formattedDateTime} (GMT ${offset})`;
}
exports.getDateWithUTCOffset = getDateWithUTCOffset;
function getCurrentMonthYear(year, month) {
    const newDate = new Date(Date.UTC(year, month));
    const date = new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
    }).format(newDate);
    return date;
}
exports.getCurrentMonthYear = getCurrentMonthYear;
//# sourceMappingURL=datetime.js.map