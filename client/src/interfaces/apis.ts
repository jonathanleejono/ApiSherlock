import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiStatusOptions,
} from "enum/apis";

interface ApiRequestData {
  url: string;
  host: ApiHostOptions;
  monitoring: ApiMonitoringOptions;
}

interface ApiDataResponse extends ApiRequestData {
  _id: string;
  status: ApiStatusOptions;
  lastPinged: string | "Never pinged";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AllApisResponse {
  allApis: ApiDataResponse[];
  totalApis: number;
  numOfPages: number;
}

interface ApiDefaultStats {
  healthy: number;
  unhealthy: number;
  pending: number;
}

interface MonthlyApis {
  date: string;
  count: number;
}

interface AllApisStatsResponse {
  defaultStats: ApiDefaultStats;
  monthlyApis: MonthlyApis[];
}

interface QueryParams {
  sort: string;
  page: number;
  monitoring: ApiMonitoringOptions | "" | "All";
  status: ApiStatusOptions | "" | "All";
  search: string;
}

export {
  ApiMonitoringOptions,
  ApiDataResponse,
  AllApisResponse,
  ApiRequestData,
  AllApisStatsResponse,
  ApiDefaultStats,
  MonthlyApis,
  QueryParams,
};
