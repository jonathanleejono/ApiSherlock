import { ApiHostOptions, ApiMonitoringOptions } from "enum/apis";
import { Api } from "models/ApiDocument";

export const mockApi: Partial<Api> = {
  url: "https://www.notarealwebsitehopefully4.com/ping",
  host: ApiHostOptions.Heroku,
  monitoring: ApiMonitoringOptions.ON,
};
