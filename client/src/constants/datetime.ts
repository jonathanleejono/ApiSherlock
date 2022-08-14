import moment from "moment-timezone";

export const currentDayYearHour = moment(Date.now())
  .tz("America/Toronto")
  .format("MMM Do YYYY, hh:mm A");
export const currentDayYear = moment(Date.now()).format("MMM Do YYYY");
