import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppProviders from "app-context/app-providers";
import { setToken } from "constants/token";
import { AuthUserResponse } from "interfaces/users";
import { ReactElement } from "react";
import { buildMockUser } from "test/data/generateMockData";
import * as usersDB from "test/data/usersDb";

async function render(
  ui: ReactElement,
  {
    route = "/landing",
    authUser = {
      user: { name: "", email: "", timezoneGMT: 0 },
      accessToken: "",
    },
    ...renderOptions
  }: {
    route?: string;
    authUser?: AuthUserResponse;
    renderOptions?: Omit<RenderOptions, "wrapper">;
  }
): Promise<RenderResult> {
  // to render the app unauthenticated, pass "null" as the authUser
  authUser = typeof authUser === "undefined" ? await loginAsUser() : authUser;

  window.history.pushState({}, "Test page", route);

  const returnValue = {
    ...rtlRender(ui, {
      wrapper: AppProviders,
      ...renderOptions,
    }),
    authUser,
  };

  return returnValue;
}

async function loginAsUser() {
  const user = buildMockUser();
  await usersDB.registerUser(user);
  const authUser = await usersDB.loginUser(user);
  setToken(authUser.accessToken);
  return authUser;
}

export * from "@testing-library/react";
export { render, userEvent, loginAsUser };
