"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentDayYearHour = exports.currentMonthYear = void 0;
const moment_1 = __importDefault(require("moment"));
exports.currentMonthYear = (0, moment_1.default)(Date.now()).format("MMM YYYY");
exports.currentDayYearHour = (0, moment_1.default)(Date.now())
    .utcOffset("-04:00")
    .format("MMM Do YYYY, hh:mm A");
//# sourceMappingURL=datetime.js.map