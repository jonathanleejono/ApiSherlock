import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import { buildMockUser } from "test/mocks/generateMockData";
import * as usersDB from "test/mocks/usersDb";
import AppProviders from "../app-context/app-providers";

async function render(
  ui: ReactElement,
  { route = "/landing", authUser = {}, ...renderOptions }
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

  // await waitForLoadingToFinish();

  return returnValue;
}

async function loginAsUser(userProperties?) {
  const user = buildMockUser(userProperties);
  await usersDB.createUser(user);
  const authUser = await usersDB.authenticateUser(user);
  window.localStorage.setItem("token", authUser.token);
  return authUser;
}

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByText(/loading/i),
      ...screen.queryAllByText(/please wait.../i),
    ],
    { timeout: 4000 }
  );

export * from "@testing-library/react";
export { render, userEvent, loginAsUser, waitForLoadingToFinish };
