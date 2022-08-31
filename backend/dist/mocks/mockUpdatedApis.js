"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUpdatedApis = void 0;
const apis_1 = require("enum/apis");
exports.mockUpdatedApis = [
    {
        url: "https://battery-cellify.herokuapp22.com/ping",
        host: apis_1.ApiHostOptions.Heroku,
        status: apis_1.ApiStatusOptions.Unhealthy,
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
    {
        url: "https://www.hello-herokuapp2.com/ping",
        host: apis_1.ApiHostOptions.Heroku,
        status: apis_1.ApiStatusOptions.Unhealthy,
        monitoring: apis_1.ApiMonitoringOptions.OFF,
    },
    {
        url: "https://www.not1arealwebsitehopefully5.com/ping",
        host: apis_1.ApiHostOptions.Heroku,
        status: apis_1.ApiStatusOptions.Unhealthy,
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
    {
        url: "https://www.not1arealwebsitehopefully2.com/ping",
        host: apis_1.ApiHostOptions.AWS,
        status: apis_1.ApiStatusOptions.Unhealthy,
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
    {
        url: "https://www.not1arealwebsitehopefully3.com/ping",
        host: apis_1.ApiHostOptions.AWS,
        status: apis_1.ApiStatusOptions.Unhealthy,
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
];
//# sourceMappingURL=mockUpdatedApis.js.map