import { ApiStats } from "interfaces/apiStats";
import { formatCurrentMonthYear } from "utils/datetime";

// plus 1 because months are 0 to 11
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();

const date = formatCurrentMonthYear(year, month);

export const mockApisStats: ApiStats = {
  defaultStats: { healthy: 0, unhealthy: 0, pending: 5 },
  monthlyApis: [
    {
      date: `${date}`,
      count: 5,
    },
  ],
};
