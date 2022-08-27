import { timezones } from "constants/timezones";

export const timezoneOffsets = [...new Set(timezones.map((tz) => tz.offset))];
