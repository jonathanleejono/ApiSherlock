import { faker } from "@faker-js/faker";
import App from "app";
import {
  createApiSuccessMsg,
  deleteApiSuccessMsg,
  editApiSuccessMsg,
  pingAllApisSuccessMsg,
  pingOneApiSuccessMsg,
  pleaseFillOutAllValues,
} from "constants/messages";
import {
  addApiRoute,
  allApisRoute,
  landingRoute,
  statsRoute,
} from "constants/routes";
import { AuthUserResponse } from "interfaces/users";
import { pendingApiStats } from "test/data/apisDb";
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

test("renders landing page", async () => {
  await renderApp({ route: landingRoute });

  expect(
    screen.getByRole("heading", { name: /api tracking app/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/React, Redux, Node, Express, Typescript, and MongoDB/i)
  ).toBeInTheDocument();
});

test("can navigate to the add-api page", async () => {
  await renderApp({ route: allApisRoute });

  const addApiButton = screen.getByLabelText(/Add Api button/i);
  expect(addApiButton).toBeInTheDocument();

  await userEvent.click(addApiButton);

  expect(screen.getByRole("heading", { name: /Add Api/i })).toBeInTheDocument();
});

test("can create an api", async () => {
  await renderApp({ route: addApiRoute });

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
    expect(await screen.findByText(createApiSuccessMsg)).toBeInTheDocument();
  });
});

test("can edit an api", async () => {
  // wait for all apis to be fetched
  await waitFor(async () => {
    await renderApp({ route: allApisRoute });
  });

  // grabs the first api object
  const editApiButton = screen.getAllByRole("link", { name: /Edit/i })[0];
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

  await userEvent.click(submitButton);

  await waitFor(async () => {
    expect(await screen.findByText(editApiSuccessMsg)).toBeInTheDocument();
  });
});

test("can delete an api", async () => {
  await waitFor(async () => {
    await renderApp({ route: allApisRoute });
  });
  const deleteApiButton = screen.getAllByRole("button", { name: /Delete/i })[1];
  expect(deleteApiButton).toBeInTheDocument();

  await userEvent.click(deleteApiButton);

  await waitFor(async () => {
    expect(await screen.findByText(deleteApiSuccessMsg)).toBeInTheDocument();
  });
});

test("can render page not found error", async () => {
  await waitFor(async () => {
    await renderApp({ route: "/stats" });
  });
  expect(await screen.findByText(/Page not found/i)).toBeInTheDocument();
});

test("can render api stats", async () => {
  await waitFor(async () => {
    await renderApp({ route: statsRoute });
  });

  const pendingApis = screen.getAllByTestId("ApiStatsCount")[2];

  expect(pendingApis.textContent).toBe(pendingApiStats.toString());
});

let consoleErrorFn: jest.SpyInstance<
  void,
  [message?: any, ...optionalParams: any[]]
>;

describe("test pinging apis", () => {
  beforeAll(() => {
    // suppress "url not found" axios error
    consoleErrorFn = jest
      .spyOn(console, "error")
      .mockImplementation(() => jest.fn());
  });

  afterAll(() => {
    consoleErrorFn.mockRestore();
  });

  test("can ping all apis", async () => {
    await waitFor(async () => {
      await renderApp({ route: allApisRoute });
    });

    const pingAllApisButton = screen.getByRole("button", { name: /Ping All/i });
    expect(pingAllApisButton).toBeInTheDocument();

    await userEvent.click(pingAllApisButton);
    await waitFor(async () => {
      expect(
        await screen.findByText(pingAllApisSuccessMsg)
      ).toBeInTheDocument();
    });
  });

  test("can ping one api", async () => {
    await waitFor(async () => {
      await renderApp({ route: allApisRoute });
    });

    const pingOneApiButton = screen.getAllByRole("button", {
      name: /Ping API/i,
    })[0];
    expect(pingOneApiButton).toBeInTheDocument();

    await userEvent.click(pingOneApiButton);

    await waitFor(async () => {
      expect(await screen.findByText(pingOneApiSuccessMsg)).toBeInTheDocument();
    });
  });
});

/* 
Notes on React Toastify Messages:

In the "notifications" folder, in handleToast(), a default success
message may be passed in, or a response from the backend may send a
success message, and either of these are used as the frontend's success
message. 

*/

describe("testing errors", () => {
  beforeAll(() => {
    consoleErrorFn = jest
      .spyOn(console, "error")
      .mockImplementation(() => jest.fn());
  });

  afterAll(() => {
    consoleErrorFn.mockRestore();
  });

  test("shows error when submitting empty field to create an api", async () => {
    await renderApp({ route: addApiRoute });

    const urlInput = screen.getByRole("textbox", {
      name: /API Url/i,
    }) as HTMLInputElement;

    expect(urlInput).toBeInTheDocument();

    await userEvent.clear(urlInput);

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.click(submitButton);

    await waitFor(async () => {
      expect((await screen.findByRole("alert")).textContent).toBe(
        pleaseFillOutAllValues
      );
    });
  });

  test("shows error when submitting empty field to edit an api", async () => {
    // wait for all apis to be fetched
    await waitFor(async () => {
      await renderApp({ route: allApisRoute });
    });

    // grabs the first api object
    const editApiButton = screen.getAllByRole("link", { name: /Edit/i })[0];
    expect(editApiButton).toBeInTheDocument();
    await userEvent.click(editApiButton);

    expect(
      screen.getByRole("heading", { name: /Edit Api/i })
    ).toBeInTheDocument();

    const urlInput = screen.getByRole("textbox", {
      name: /API Url/i,
    }) as HTMLInputElement;
    expect(urlInput).toBeInTheDocument();

    await userEvent.clear(urlInput);

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.click(submitButton);

    await waitFor(async () => {
      expect(
        await screen.findByText(pleaseFillOutAllValues)
      ).toBeInTheDocument();
    });
  });
});
