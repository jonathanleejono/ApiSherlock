import moment from "moment";

export const currentMonthYear = moment(Date.now()).format("MMM YYYY");

export const currentDayYearHour = moment(Date.now())
  .utcOffset("-04:00")
  .format("MMM Do YYYY, hh:mm A");
