/* 
getDateWithUTCOffset:

- "Date.now()" -> gets the current time
- "new Date().getTimezoneOffset() * 1000 * 60" -> gets the difference 
from the current server time and the UTC time (GMT 0) in minutes
  - if the server uses UTC GMT 0, then there is no difference
- "1000 * 60 * 60 * offset" -> calculates the offset of specific timezone

Date.now() vs. new Date.getTime():
- time is “frozen” when the new Date() constructor is called, 
and “getTime” would tell the time at the time the variable gets set, 
whereas Date.now() is called right when the variable is used
*/

export function getDateWithUTCOffset(offset: number, showTime = true) {
  try {
    const currentDateTime =
      Date.now() +
      new Date().getTimezoneOffset() * 1000 * 60 +
      1000 * 60 * 60 * offset;

    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: showTime ? "medium" : undefined,
    }).format(currentDateTime);

    return `${formattedDateTime} (GMT ${offset})`;
  } catch (error) {
    console.error("Error getting date: ", error);
    return "Error getting date";
  }
}

//this is used to match MongoDB's date string formatting
export const constructDateTime = () => new Date().toISOString();

export function formatMonthYear(date: string, timezoneOffset: number) {
  try {
    const newDate = new Date(date);

    // +1 is needed because months go from 0 to 11
    const month = newDate.getMonth() + 1;

    const year = newDate.getFullYear();

    // day might be different if hour passes midnight,
    // which is why timezone offset is included
    const createdAtWithUTCOffset =
      Date.UTC(year, month) + 1000 * 60 * 60 * timezoneOffset;

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(createdAtWithUTCOffset);

    return formattedDate;
  } catch (error) {
    console.error("Error formatting date: ", error);
    console.error("Error input date: ", date);
    return "Error formatting date";
  }
}
