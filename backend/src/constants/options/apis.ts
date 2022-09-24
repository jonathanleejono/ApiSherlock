import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiQueryParamsEnum,
  ApiSortOptions,
  ApiStatusOptions,
} from "enum/apis";
import ApiCollection from "models/ApiCollection";

export const validCreateApiKeys = Object.keys(ApiCollection.schema.obj);

export const validUpdateApiKeys = validCreateApiKeys;

export const validApiSearchParams = Object.values(ApiQueryParamsEnum);

export const validApiSortOptions = Object.values(ApiSortOptions);

export const validApiStatusOptions = Object.values(ApiStatusOptions);

export const validApiMonitoringOptions = Object.values(ApiMonitoringOptions);

export const validApiHostOptions = Object.values(ApiHostOptions);
