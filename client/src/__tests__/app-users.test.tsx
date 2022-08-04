import { faker } from "@faker-js/faker";
import App from "app";
import {
  authUserSuccessMsg,
  pleaseFillOutAllValues,
  updateUserSuccessMsg,
} from "constants/messages";
import { profileRoute, registerRoute } from "constants/routes";
import { AuthUserResponse } from "interfaces/users";
import { mockUserPassword } from "test/data/generateMockData";
import {
  loginAsUser,
  render,
  screen,
  userEvent,
  waitFor,
} from "test/render-utils";

// this file must be named with .tsx because React component is used

async function renderApp({
  authUser,
  route,
}: {
  authUser?: AuthUserResponse;
  route?: string;
} = {}) {
  if (authUser === undefined) {
    authUser = await loginAsUser();
  }
  const utils = await render(<App />, { authUser, route });

  return {
    ...utils,
    authUser,
  };
}

test("user can register", async () => {
  await renderApp({ route: registerRoute });

  const goToRegisterPageButton = screen.getByRole("button", {
    name: /Register/i,
  });

  expect(goToRegisterPageButton).toBeInTheDocument();

  await userEvent.click(goToRegisterPageButton);

  expect(
    screen.getByRole("heading", { name: /Register/i })
  ).toBeInTheDocument();

  const nameField = screen.getByLabelText(/name/i) as HTMLInputElement;
  const emailField = screen.getByLabelText(/email/i) as HTMLInputElement;
  const passwordField = screen.getByLabelText(/password/i) as HTMLInputElement;

  const fakeName = faker.name.firstName();
  const fakeEmail = faker.internet.email();
  const fakePassword = faker.internet.password();

  await userEvent.type(nameField, fakeName);
  await userEvent.type(emailField, fakeEmail);
  await userEvent.type(passwordField, fakePassword);

  expect(nameField.value).toBe(fakeName);
  expect(emailField.value).toBe(fakeEmail);
  expect(passwordField.value).toBe(fakePassword);

  const submitButton = screen.getByRole("button", { name: "submit" });

  await userEvent.click(submitButton);

  await waitFor(async () => {
    expect(
      await screen.findByText(authUserSuccessMsg(fakeName))
    ).toBeInTheDocument();
  });
});

test("user can login", async () => {
  // register route is the same as login route
  const { authUser } = await renderApp({ route: registerRoute });

  const { user } = authUser;

  expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();

  const emailField = screen.getByLabelText(/email/i) as HTMLInputElement;
  const passwordField = screen.getByLabelText(/password/i) as HTMLInputElement;

  await userEvent.type(emailField, user.email);
  await userEvent.type(passwordField, mockUserPassword);

  expect(emailField.value).toBe(user.email);
  expect(passwordField.value).toBe(mockUserPassword);

  const submitButton = screen.getByRole("button", { name: "submit" });

  await userEvent.click(submitButton);

  await waitFor(async () => {
    expect(
      await screen.findByText(authUserSuccessMsg(user.name))
    ).toBeInTheDocument();
  });
});

test("user can update profile", async () => {
  // need await waitFor to load user data
  await waitFor(async () => {
    await renderApp({ route: profileRoute });
  });

  expect(screen.getByRole("heading", { name: /Profile/i })).toBeInTheDocument();

  const nameField = screen.getByLabelText(/name/i) as HTMLInputElement;

  await userEvent.clear(nameField);

  const newName = faker.name.firstName();

  await userEvent.type(nameField, newName);

  const submitButton = screen.getByRole("button", { name: /save changes/i });

  await userEvent.click(submitButton);

  await waitFor(async () => {
    expect(await screen.findByText(updateUserSuccessMsg)).toBeInTheDocument();
  });

  // the user's first name is in the navbar/menu profile
  expect(screen.getByRole("button", { name: newName })).toBeInTheDocument();
});

describe("testing user errors", () => {
  test("shows error when submitting empty field to register user", async () => {
    await renderApp({ route: registerRoute });

    const goToRegisterPageButton = screen.getByRole("button", {
      name: /Register/i,
    });

    expect(goToRegisterPageButton).toBeInTheDocument();

    await userEvent.click(goToRegisterPageButton);

    expect(
      screen.getByRole("heading", { name: /Register/i })
    ).toBeInTheDocument();

    const emailField = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordField = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement;

    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password();

    await userEvent.type(emailField, fakeEmail);
    await userEvent.type(passwordField, fakePassword);

    expect(emailField.value).toBe(fakeEmail);
    expect(passwordField.value).toBe(fakePassword);

    const submitButton = screen.getByRole("button", { name: "submit" });

    await userEvent.click(submitButton);

    await waitFor(async () => {
      expect((await screen.findByRole("alert")).textContent).toBe(
        pleaseFillOutAllValues
      );
    });
  });

  test("shows error when submitting empty field to login user", async () => {
    // register route is the same as login route
    const { authUser } = await renderApp({ route: registerRoute });

    const { user } = authUser;

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();

    const emailField = screen.getByLabelText(/email/i) as HTMLInputElement;

    await userEvent.type(emailField, user.email);

    expect(emailField.value).toBe(user.email);

    const submitButton = screen.getByRole("button", { name: "submit" });

    await userEvent.click(submitButton);

    await waitFor(async () => {
      expect((await screen.findByRole("alert")).textContent).toBe(
        pleaseFillOutAllValues
      );
    });
  });

  test("shows error when submitting empty field to update user", async () => {
    // need await waitFor to load user data
    await waitFor(async () => {
      await renderApp({ route: profileRoute });
    });

    expect(
      screen.getByRole("heading", { name: /Profile/i })
    ).toBeInTheDocument();

    const nameField = screen.getByLabelText(/name/i) as HTMLInputElement;

    await userEvent.clear(nameField);

    const submitButton = screen.getByRole("button", { name: /save changes/i });

    await userEvent.click(submitButton);

    await waitFor(async () => {
      expect((await screen.findByRole("alert")).textContent).toBe(
        pleaseFillOutAllValues
      );
    });
  });
});
