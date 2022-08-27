import { ApiHostOptions, ApiMonitoringOptions } from "enum/apis";

export const mockApi = {
  url: "https://www.notarealwebsitehopefully4.com/ping",
  host: ApiHostOptions.Heroku,
  monitoring: ApiMonitoringOptions.ON,
};
