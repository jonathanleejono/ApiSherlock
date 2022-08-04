import moment from "moment";

const currentMonthYear = moment().format("MMM YYYY");

export const mockApisStats = {
  defaultStats: { healthy: 0, unhealthy: 0, pending: 5 },
  monthlyApis: [
    {
      date: `${currentMonthYear}`,
      count: 5,
    },
  ],
};
