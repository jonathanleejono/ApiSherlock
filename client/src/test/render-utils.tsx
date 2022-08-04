import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppProviders from "app-context/app-providers";
import { AuthUserResponse } from "interfaces/users";
import { ReactElement } from "react";
import { buildMockUser } from "test/data/generateMockData";
import * as usersDB from "test/data/usersDb";
import { tokenKey } from "./constants/keys";

async function render(
  ui: ReactElement,
  {
    route = "/landing",
    authUser = { user: { name: "", email: "" }, token: "" },
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
  await usersDB.createUser(user);
  const authUser = await usersDB.authenticateUser(user);
  window.localStorage.setItem(tokenKey, authUser.token);
  return authUser;
}

export * from "@testing-library/react";
export { render, userEvent, loginAsUser };
