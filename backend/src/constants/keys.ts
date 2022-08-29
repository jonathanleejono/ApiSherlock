import { mockApi } from "mocks/mockApi";
import { mockUser } from "mocks/mockUser";

// mockUser uses User typing
const { name, email, password, timezoneGMT } = mockUser;

export const validRegisterKeys = Object.keys(mockUser);

export const validLoginKeys = Object.keys({ email, password });

export const validUpdateKeys = Object.keys({ name, email, timezoneGMT });

export const validCreateApiKeys = Object.keys(mockApi);

export const validUpdateApiKeys = validCreateApiKeys;

export const validGetAllApisKeys = [
  "status",
  "monitoring",
  "sort",
  "search",
  "page",
  "limit",
  "search",
];
