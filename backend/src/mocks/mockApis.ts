import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiStatusOptions,
} from "enum/apis";

export const mockApis = [
  {
    url: "https://battery-cellify.herokuapp.com/ping",
    host: ApiHostOptions.Heroku,
    status: ApiStatusOptions.Pending,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
    __v: 0,
  },
  {
    url: "https://www.hello-herokuapp2.com/ping",
    host: ApiHostOptions.Heroku,
    status: ApiStatusOptions.Pending,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.OFF,
    __v: 0,
  },
  {
    url: "https://www.not1arealwebsitehopefully5.com/ping",
    host: ApiHostOptions.Heroku,
    status: ApiStatusOptions.Pending,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
    __v: 0,
  },
  {
    url: "https://www.not1arealwebsitehopefully2.com/ping",
    host: ApiHostOptions.AWS,
    status: ApiStatusOptions.Pending,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
    __v: 0,
  },
  {
    url: "https://www.not1arealwebsitehopefully3.com/ping",
    host: ApiHostOptions.AWS,
    status: ApiStatusOptions.Pending,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
    __v: 0,
  },
];
