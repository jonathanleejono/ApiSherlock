import moment from "moment";

export const currentDayYearHour = moment(Date.now()).format(
  "MMM Do YYYY, hh:mm A"
);
export const currentDayYear = moment(Date.now()).format("MMM Do YYYY");
