import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiQueryParamsEnum,
  ApiSortOptions,
  ApiStatusOptions,
} from "enum/apis";
import { mockApi } from "mocks/mockApi";

export const validCreateApiKeys = Object.keys(mockApi);

export const validUpdateApiKeys = validCreateApiKeys;

export const validApiSearchParams = Object.values(ApiQueryParamsEnum);

export const validApiSortOptions = Object.values(ApiSortOptions);

export const validApiStatusOptions = Object.values(ApiStatusOptions);

export const validApiMonitoringOptions = Object.values(ApiMonitoringOptions);

export const validApiHostOptions = Object.values(ApiHostOptions);
