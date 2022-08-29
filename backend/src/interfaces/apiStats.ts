export interface MonthlyApis {
  date: string;
  count: number;
}

export interface ApiDefaultStats {
  healthy: number;
  unhealthy: number;
  pending: number;
}

export interface ApiStats {
  defaultStats: ApiDefaultStats;
  monthlyApis: MonthlyApis[];
}
