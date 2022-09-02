import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiQueryParams,
  ApiSortOptions,
  ApiStatusOptions,
} from "enum/apis";
import { ApiRequestData } from "interfaces/apis";

const mockApi: ApiRequestData = {
  url: "https://www.notarealwebsitehopefully4.com/ping",
  host: ApiHostOptions.HEROKU,
  monitoring: ApiMonitoringOptions.ON,
};

export const validCreateApiKeys = Object.keys(mockApi);

export const validUpdateApiKeys = validCreateApiKeys;

export const validApiSearchParams = Object.values(ApiQueryParams);

export const validApiSortOptions = Object.values(ApiSortOptions);

export const validApiStatusOptions = Object.values(ApiStatusOptions);

export const validApiMonitoringOptions = Object.values(ApiMonitoringOptions);

export const validApiHostOptions = Object.values(ApiHostOptions);
