"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timezoneOffsets = void 0;
const timezones_1 = require("constants/timezones");
exports.timezoneOffsets = [...new Set(timezones_1.timezones.map((tz) => tz.offset))];
//# sourceMappingURL=timezoneOffsets.js.map