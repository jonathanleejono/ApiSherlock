"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockApisStats = void 0;
const datetime_1 = require("utils/datetime");
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();
const date = (0, datetime_1.formatCurrentMonthYear)(year, month);
exports.mockApisStats = {
    defaultStats: { healthy: 0, unhealthy: 0, pending: 5 },
    monthlyApis: [
        {
            date: `${date}`,
            count: 5,
        },
    ],
};
//# sourceMappingURL=mockApisStats.js.map