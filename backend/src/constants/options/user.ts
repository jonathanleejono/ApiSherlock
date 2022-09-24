import UserCollection from "models/UserCollection";

export const validRegisterKeys = Object.keys(UserCollection.schema.obj);

export const validLoginKeys = ["email", "password"];

export const validUpdateUserKeys = ["name", "email", "timezoneGMT"];
