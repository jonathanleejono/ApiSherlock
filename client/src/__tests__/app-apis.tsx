import { faker } from "@faker-js/faker";
import {
  loginAsUser,
  render,
  screen,
  userEvent,
  waitFor,
} from "test/render-utils";
import App from "../app";

// file name must be .tsx because React component is used

async function renderApp({
  authUser,
  route,
}: {
  authUser?: object;
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

test("renders landing page", async () => {
  await renderApp({ route: "/landing" });

  expect(
    screen.getByRole("heading", { name: /api tracking app/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/React, Node, Express, Typescript, and MongoDB/i)
  ).toBeInTheDocument();
});

test("can navigate to the add-api page", async () => {
  await renderApp({ route: "/all-apis" });

  const addApiButton = screen.getByLabelText(/Add Api button/i);
  expect(addApiButton).toBeInTheDocument();

  await userEvent.click(addApiButton);

  expect(screen.getByRole("heading", { name: /Add Api/i })).toBeInTheDocument();
});

test("can create an api", async () => {
  await renderApp({ route: "/add-api" });

  const newText = faker.lorem.words();

  const urlInput = screen.getByRole("textbox", {
    name: /API Url/i,
  }) as HTMLInputElement;

  expect(urlInput).toBeInTheDocument();

  await userEvent.clear(urlInput);
  await userEvent.type(urlInput, newText);

  expect(urlInput.value).toBe(newText);

  const submitButton = screen.getByRole("button", { name: /submit/i });

  await userEvent.click(submitButton);

  await waitFor(async () => {
    expect(await screen.findByText(/Api Added/i)).toBeInTheDocument();
  });
});

test("can edit an api", async () => {
  // wait for all apis to be fetched
  await waitFor(async () => {
    await renderApp({ route: "/all-apis" });
  });

  const editApiButton = screen.getAllByRole("link", { name: /Edit/i })[0];
  // grabs the first api object
  expect(editApiButton).toBeInTheDocument();
  await userEvent.click(editApiButton);

  expect(
    screen.getByRole("heading", { name: /Edit Api/i })
  ).toBeInTheDocument();

  const newText = faker.lorem.words();
  const urlInput = screen.getByRole("textbox", {
    name: /API Url/i,
  }) as HTMLInputElement;
  expect(urlInput).toBeInTheDocument();

  await userEvent.clear(urlInput);
  await userEvent.type(urlInput, newText);

  expect(urlInput.value).toBe(newText);

  const submitButton = screen.getByRole("button", { name: /submit/i });

  await waitFor(async () => {
    await userEvent.click(submitButton);
    expect(await screen.findByText(/Api modified/i)).toBeInTheDocument();
  });
});

test("can delete an api", async () => {
  await waitFor(async () => {
    await renderApp({ route: "/all-apis" });
  });
  const deleteApiButton = screen.getAllByRole("button", { name: /Delete/i })[1];
  expect(deleteApiButton).toBeInTheDocument();

  await userEvent.click(deleteApiButton);
  await waitFor(async () => {
    expect(await screen.findByText(/Api Deleted/i)).toBeInTheDocument();
  });
});
