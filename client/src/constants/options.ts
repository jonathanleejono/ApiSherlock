import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiSortOptions,
  ApiStatusOptions,
} from "enum/apis";

export const apiStatusOptions = [
  ApiStatusOptions.Healthy,
  ApiStatusOptions.Unhealthy,
  ApiStatusOptions.Pending,
];

export const apiSortOptions = [
  ApiSortOptions.Latest,
  ApiSortOptions.Oldest,
  ApiSortOptions.A_Z,
  ApiSortOptions.Z_A,
];

export const apiMonitoringOptions = [
  ApiMonitoringOptions.ON,
  ApiMonitoringOptions.OFF,
];
export const apiHostOptions = [
  ApiHostOptions.AWS,
  ApiHostOptions.GCP,
  ApiHostOptions.Azure,
  ApiHostOptions.Heroku,
  ApiHostOptions.DigitalOcean,
  ApiHostOptions.Other,
];
