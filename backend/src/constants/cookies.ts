import { PROD_ENV } from "constants/envVars";

export const cookieName = "apiSherlockId";
export const cookieExpiryTime = 1000 * 60 * 60 * 24; // one day
export const cookieSecureSetting = PROD_ENV ? true : false;
export const cookieSameSiteSetting = PROD_ENV ? "none" : "lax";
export const cookieHttpOnlySetting = PROD_ENV ? true : false;
