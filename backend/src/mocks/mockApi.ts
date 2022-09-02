import { ApiHostOptions, ApiMonitoringOptions } from "enum/apis";
import { Api } from "models/ApiDocument";

/* 
Omit<> will require "url", "host", and "monitoring",
but not the _id or createdBy fields, while Partial<>
would make everything optional (ie. no error would be provided
if url, host, or monitoring was missing)
*/

export const mockApi: Omit<Api, "_id" | "createdBy" | "status" | "lastPinged"> =
  {
    url: "https://www.notarealwebsitehopefully4.com/ping",
    host: ApiHostOptions.HEROKU,
    monitoring: ApiMonitoringOptions.ON,
  };
