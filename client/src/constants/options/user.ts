import { RegisterUserData } from "interfaces/users";

const mockUser: RegisterUserData = {
  name: "jane",
  email: "janedoe1@gmail.com",
  password: "password",
  timezoneGMT: -4,
};

const { name, email, password, timezoneGMT } = mockUser;

export const validRegisterKeys = Object.keys(mockUser);

export const validLoginKeys = Object.keys({ email, password });

export const validUpdateUserKeys = Object.keys({ name, email, timezoneGMT });
