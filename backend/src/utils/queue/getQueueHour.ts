import { MonitorDateAMOrPMOptions } from "enum/monitor";

export function getQueueHour(dateHour: number, dateAMOrPM: string) {
  let hour = dateHour;

  //if it's 12AM, the hour should be 0:00AM to match cron
  if (dateHour === 12 && dateAMOrPM === MonitorDateAMOrPMOptions.AM) {
    hour = dateHour - 12;
  }

  //if it's PM and not 12PM, add 12 hours, eg. 3PM -> 15:00
  if (dateHour !== 12 && dateAMOrPM === MonitorDateAMOrPMOptions.PM) {
    hour = dateHour + 12;
  }

  //if it's 12PM, don't add or subtract anything, leave as 12:00
  if (dateHour === 12 && dateAMOrPM === MonitorDateAMOrPMOptions.PM) {
    hour = dateHour;
  }

  return hour;
}
