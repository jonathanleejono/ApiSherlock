"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockApis = void 0;
const apis_1 = require("enum/apis");
exports.mockApis = [
    {
        url: "https://battery-cellify.herokuapp.com/ping",
        host: apis_1.ApiHostOptions.Heroku,
        status: apis_1.ApiStatusOptions.Pending,
        lastPinged: "Never pinged",
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
    {
        url: "https://www.hello-herokuapp2.com/ping",
        host: apis_1.ApiHostOptions.Heroku,
        status: apis_1.ApiStatusOptions.Pending,
        lastPinged: "Never pinged",
        monitoring: apis_1.ApiMonitoringOptions.OFF,
    },
    {
        url: "https://www.not1arealwebsitehopefully5.com/ping",
        host: apis_1.ApiHostOptions.Heroku,
        status: apis_1.ApiStatusOptions.Pending,
        lastPinged: "Never pinged",
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
    {
        url: "https://www.not1arealwebsitehopefully2.com/ping",
        host: apis_1.ApiHostOptions.AWS,
        status: apis_1.ApiStatusOptions.Pending,
        lastPinged: "Never pinged",
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
    {
        url: "https://www.not1arealwebsitehopefully3.com/ping",
        host: apis_1.ApiHostOptions.AWS,
        status: apis_1.ApiStatusOptions.Pending,
        lastPinged: "Never pinged",
        monitoring: apis_1.ApiMonitoringOptions.ON,
    },
];
//# sourceMappingURL=mockApis.js.map