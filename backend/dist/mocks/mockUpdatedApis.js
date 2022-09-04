"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUpdatedApis = exports.editMockApiUrl = void 0;
const apis_1 = require("enum/apis");
exports.editMockApiUrl = "https://battery-cellify.herokuapp22.com/ping";
exports.mockUpdatedApis = [
    {
        url: exports.editMockApiUrl,
        host: apis_1.ApiHostOptions.HEROKU,
        status: apis_1.ApiStatusOptions.UNHEALTHY,
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
    {
        url: "https://www.hello-herokuapp2.com/ping",
        host: apis_1.ApiHostOptions.HEROKU,
        status: apis_1.ApiStatusOptions.UNHEALTHY,
        monitoring: apis_1.ApiMonitoringOptions.OFF,
    },
    {
        url: "https://www.not1arealwebsitehopefully1.com/ping",
        host: apis_1.ApiHostOptions.HEROKU,
        status: apis_1.ApiStatusOptions.UNHEALTHY,
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
    {
        url: "https://www.not1arealwebsitehopefully2.com/ping",
        host: apis_1.ApiHostOptions.AWS,
        status: apis_1.ApiStatusOptions.UNHEALTHY,
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
    {
        url: "https://www.not1arealwebsitehopefully3.com/ping",
        host: apis_1.ApiHostOptions.AWS,
        status: apis_1.ApiStatusOptions.UNHEALTHY,
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
];
//# sourceMappingURL=mockUpdatedApis.js.map