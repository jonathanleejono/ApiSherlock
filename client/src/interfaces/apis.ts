interface ApiRequestData {
  url: string;
  host: "AWS" | "GCP" | "Azure" | "Heroku" | "DigitalOcean" | "Other";
  monitoring: "on" | "off";
}

interface ApiDataResponse extends ApiRequestData {
  _id: string;
  status: "healthy" | "unhealthy" | "pending";
  lastPinged: number | "Never pinged";
  createdBy: string;
  createdAt: number;
  updatedAt: number;
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
  // the backend output for monthlyApis is an array
  monthlyApis: [MonthlyApis];
}

type QueryParamsOptions = {
  [key: string]: string | number;
};

interface QueryParams extends QueryParamsOptions {
  sort: string;
  page: number;
  monitoring: "on" | "off" | "" | "All";
  status: "healthy" | "unhealthy" | "pending" | "" | "All";
  search: string;
}

export {
  ApiDataResponse,
  AllApisResponse,
  ApiRequestData,
  AllApisStatsResponse,
  ApiDefaultStats,
  MonthlyApis,
  QueryParams,
};
