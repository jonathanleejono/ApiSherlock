import { User } from "models/UserDocument";

export const mockUser: Omit<User, "_id"> = {
  name: "jane",
  email: "janedoe1@gmail.com",
  password: "password",
  timezoneGMT: -4,
};
