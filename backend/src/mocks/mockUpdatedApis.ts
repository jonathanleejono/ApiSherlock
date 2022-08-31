import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiStatusOptions,
} from "enum/apis";
import { Api } from "models/ApiDocument";

export const mockUpdatedApis: Omit<Api, "_id" | "createdBy" | "lastPinged">[] =
  [
    {
      url: "https://battery-cellify.herokuapp22.com/ping",
      host: ApiHostOptions.Heroku,
      status: ApiStatusOptions.Unhealthy,
      monitoring: ApiMonitoringOptions.ON,
    },
    {
      url: "https://www.hello-herokuapp2.com/ping",
      host: ApiHostOptions.Heroku,
      status: ApiStatusOptions.Unhealthy,
      monitoring: ApiMonitoringOptions.OFF,
    },
    {
      url: "https://www.not1arealwebsitehopefully5.com/ping",
      host: ApiHostOptions.Heroku,
      status: ApiStatusOptions.Unhealthy,
      monitoring: ApiMonitoringOptions.ON,
    },
    {
      url: "https://www.not1arealwebsitehopefully2.com/ping",
      host: ApiHostOptions.AWS,
      status: ApiStatusOptions.Unhealthy,
      monitoring: ApiMonitoringOptions.ON,
    },
    {
      url: "https://www.not1arealwebsitehopefully3.com/ping",
      host: ApiHostOptions.AWS,
      status: ApiStatusOptions.Unhealthy,
      monitoring: ApiMonitoringOptions.ON,
    },
  ];
