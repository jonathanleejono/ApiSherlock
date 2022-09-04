import { timezones } from "constants/options/timezones";

export const timezoneOffsets = [
  ...new Set(timezones.map((tz) => tz.offset)),
].reverse();
