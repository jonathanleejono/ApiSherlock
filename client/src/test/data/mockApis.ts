import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiStatusOptions,
} from "enum/apis";
import { ApiDataResponse } from "interfaces/apis";
import { constructDateTime } from "utils/datetime";

export const mockApis: ApiDataResponse[] = [
  {
    url: "https://battery-cellify.herokuapp.com/ping",
    host: ApiHostOptions.HEROKU,
    status: ApiStatusOptions.PENDING,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
    __v: 0,
    _id: "618645616",
    createdAt: constructDateTime(),
    updatedAt: constructDateTime(),
    createdBy: "",
  },
  {
    url: "https://www.hello-herokuapp2.com/ping",
    host: ApiHostOptions.HEROKU,
    status: ApiStatusOptions.PENDING,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
    __v: 0,
    _id: "0525509283",
    createdAt: constructDateTime(),
    updatedAt: constructDateTime(),
    createdBy: "",
  },
  {
    url: "https://www.not1arealwebsiteh1opefully5.com/ping",
    host: ApiHostOptions.HEROKU,
    status: ApiStatusOptions.PENDING,
    lastPinged: "Never pinged",
    monitoring: ApiMonitoringOptions.ON,
    __v: 0,
    _id: "547928246",
    createdAt: constructDateTime(),
    updatedAt: constructDateTime(),
    createdBy: "",
  },
];
