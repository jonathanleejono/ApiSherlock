/* 
getDateWithUTCOffset:

- Example:
(Local computer) Current Server Time: 10:00AM GMT -4
App User's Selected Timezone: GMT -6
  -> The function getDateWithUTCOffset adds the current server time, with
  the difference in the current time and GMT 0
  (this is currentServerDateTime + localServerTimeDiffWithUTC)
New Adjusted Current Server Time: 10:00AM GMT -4 + (240 mins) = 2:00PM GMT 0
  -> Then, the adjusted server time gets added with the user's timezone
Final Adjusted Time: 2:00PM GMT 0 + (GMT -6) = 8:00AM GMT -6

- The function's goal is to bring the current server time to "0"
and then add the user's timezone offset to get the correct time
- If the current server time was 10:00AM GMT +4, the UTC difference 
would have been -240 mins, which would still bring the adjusted
server time to 2:00PM GMT 0

Date.now() vs. new Date.getTime():
- time is “frozen” when the new Date() constructor is called, 
and “getTime” would tell the time at the time the variable gets set, 
whereas Date.now() is called right when the variable is used
*/

export function getDateWithUTCOffset(
  userTimezone: number,
  showTime = true
): string {
  try {
    const currentServerDateTime = Date.now();

    const localServerTimeDiffWithUTC =
      new Date().getTimezoneOffset() * 1000 * 60;

    const timezoneOffset = 1000 * 60 * 60 * userTimezone;

    const currentDateTimeAdjusted =
      currentServerDateTime + localServerTimeDiffWithUTC + timezoneOffset;

    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: showTime ? "medium" : undefined,
    }).format(currentDateTimeAdjusted);

    return `${formattedDateTime} (GMT ${userTimezone})`;
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
