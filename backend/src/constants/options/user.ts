import { mockUser } from "mocks/mockUser";

// mockUser uses User typing
const { name, email, password, timezoneGMT } = mockUser;

export const validRegisterKeys = Object.keys(mockUser);

export const validLoginKeys = Object.keys({ email, password });

export const validUpdateUserKeys = Object.keys({ name, email, timezoneGMT });
