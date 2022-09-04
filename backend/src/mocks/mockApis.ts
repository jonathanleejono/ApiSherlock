import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiStatusOptions,
} from "enum/apis";
import { Api } from "models/ApiDocument";

export const mockApis: Omit<Api, "_id" | "createdBy">[] = [
  {
    url: "https://battery-cellify.herokuapp.com/ping",
    host: ApiHostOptions.HEROKU,
    status: ApiStatusOptions.PENDING,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
  },
  {
    url: "https://www.hello-herokuapp2.com/ping",
    host: ApiHostOptions.HEROKU,
    status: ApiStatusOptions.PENDING,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.OFF,
  },
  {
    url: "https://www.not1arealwebsitehopefully1.com/ping",
    host: ApiHostOptions.HEROKU,
    status: ApiStatusOptions.PENDING,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
  },
  {
    url: "https://www.not1arealwebsitehopefully2.com/ping",
    host: ApiHostOptions.AWS,
    status: ApiStatusOptions.PENDING,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
  },
  {
    url: "https://www.not1arealwebsitehopefully3.com/ping",
    host: ApiHostOptions.AWS,
    status: ApiStatusOptions.PENDING,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
  },
];
