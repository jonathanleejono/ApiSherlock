import {
  ApiHostOptions,
  ApiMonitoringOptions,
  ApiSortOptions,
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
  lastPinged: string;
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

interface ApiQueryParams {
  sort: ApiSortOptions | "";
  status: ApiStatusOptions | "" | "All";
  monitoring: ApiMonitoringOptions | "" | "All";
  host: ApiHostOptions | "" | "All";
  page: number;
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
  ApiQueryParams,
};
