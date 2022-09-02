import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiStatusOptions,
} from "enum/apis";
import { Api } from "models/ApiDocument";

export const editMockApiUrl = "https://battery-cellify.herokuapp22.com/ping";

export const mockUpdatedApis: Omit<Api, "_id" | "createdBy" | "lastPinged">[] =
  [
    {
      url: editMockApiUrl,
      host: ApiHostOptions.HEROKU,
      status: ApiStatusOptions.UNHEALTHY,
      monitoring: ApiMonitoringOptions.ON,
    },
    {
      url: "https://www.hello-herokuapp2.com/ping",
      host: ApiHostOptions.HEROKU,
      status: ApiStatusOptions.UNHEALTHY,
      monitoring: ApiMonitoringOptions.OFF,
    },
    {
      url: "https://www.not1arealwebsitehopefully1.com/ping",
      host: ApiHostOptions.HEROKU,
      status: ApiStatusOptions.UNHEALTHY,
      monitoring: ApiMonitoringOptions.ON,
    },
    {
      url: "https://www.not1arealwebsitehopefully2.com/ping",
      host: ApiHostOptions.AWS,
      status: ApiStatusOptions.UNHEALTHY,
      monitoring: ApiMonitoringOptions.ON,
    },
    {
      url: "https://www.not1arealwebsitehopefully3.com/ping",
      host: ApiHostOptions.AWS,
      status: ApiStatusOptions.UNHEALTHY,
      monitoring: ApiMonitoringOptions.ON,
    },
  ];
