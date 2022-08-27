export const validRegisterKeys = ["name", "email", "password", "timezoneGMT"];

export const validLoginKeys = ["email", "password"];

export const validUpdateKeys = ["name", "email", "timezoneGMT"];

export const validCreateApiKeys = ["url", "host", "monitoring"];

export const validUpdateApiKeys = [...validCreateApiKeys];

export const validGetAllApisKeys = [
  "status",
  "monitoring",
  "sort",
  "search",
  "page",
  "limit",
  "search",
];
