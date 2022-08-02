import moment from "moment";

const currentMonthYear = moment().format("MMM YYYY");

export const mockApisStats = {
  defaultStats: { healthy: 0, unhealthy: 0, pending: 5 },
  monthlyApplications: [
    {
      date: `${currentMonthYear}`,
      count: 5,
    },
  ],
};
