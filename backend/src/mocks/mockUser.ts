import { User } from "models/UserDocument";

export const mockUser: Partial<User> = {
  name: "jane",
  email: "janedoe1@gmail.com",
  password: "password",
  timezoneGMT: -4,
};
