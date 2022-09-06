import App from "App";
import {
  authUserSuccessMsg,
  createMonitorSuccessMsg,
  deleteMonitorSuccessMsg,
  editMonitorSuccessMsg,
  removeQueueSuccessMsg,
  startQueueSuccessMsg,
} from "constants/messages";
import { allApisRoute, monitoringRoute, registerRoute } from "constants/routes";
import { MonitorSettingOptions } from "enum/monitor";
import { MonitorDataResponse } from "interfaces/monitor";
import { AuthUserResponse } from "interfaces/users";
import { buildMockMonitor, mockUserPassword } from "test/data/generateMockData";
import * as monitorDB from "test/data/monitorDb";
import { userHash } from "test/data/usersDb";
import {
  loginAsUser,
  render,
  screen,
  userEvent,
  waitFor,
} from "test/render-utils";

// this file must be named with .tsx because React component is used

async function renderApp(
  {
    authUser,
    route,
    monitor,
    useMockMonitor,
  }: {
    authUser?: AuthUserResponse;
    route?: string;
    monitor?: MonitorDataResponse;
    useMockMonitor?: boolean;
  } = { useMockMonitor: false }
) {
  if (authUser === undefined) {
    authUser = await loginAsUser();
  }
  if (monitor === undefined && useMockMonitor) {
    const userId = userHash(authUser.user.email);
    monitor = await monitorDB.createMonitor(
      buildMockMonitor({ createdBy: userId })
    );
  }
  const utils = await render(<App />, { authUser, route });

  return {
    ...utils,
    authUser,
    monitor,
  };
}

describe("testing monitoring page", () => {
  //errors may occur if app is rendered in a beforeAll to login,
  //so a login test is used instead
  test("login as a user first", async () => {
    // register route is the same as login route
    const { authUser } = await renderApp({ route: registerRoute });

    const { user } = authUser;

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();

    const emailField = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordField = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement;

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

  test("can navigate to the monitoring page", async () => {
    // wait for allApis to be fetched
    // so the apis can be monitored later
    await waitFor(async () => {
      await renderApp({ route: allApisRoute });
    });

    const monitoringNavLink = screen.getByRole("link", {
      name: /monitoring/i,
    });
    expect(monitoringNavLink).toBeInTheDocument();

    await userEvent.click(monitoringNavLink);

    expect(
      screen.getByRole("heading", { name: "Monitoring" })
    ).toBeInTheDocument();
  });

  test("can edit a monitor", async () => {
    // wait for monitor to be fetched
    await waitFor(async () => {
      await renderApp({ route: monitoringRoute, useMockMonitor: true });
    });

    const monitorSettingOnOption = screen.getByRole("option", {
      name: MonitorSettingOptions.ON, // "monday" gets caught by regex /ON/i
      //eslint-disable-next-line
    }) as any;

    expect(monitorSettingOnOption.selected).toBe(true);

    const monitorScheduleTypeOptions = screen.getByRole("combobox", {
      name: /schedule type/i,
    });

    const monitorScheduleTypeDateOption = screen.getByRole("option", {
      name: /interval/i,
      //eslint-disable-next-line
    }) as any;

    await userEvent.selectOptions(
      monitorScheduleTypeOptions,
      monitorScheduleTypeDateOption
    );

    expect(monitorScheduleTypeDateOption.selected).toBe(true);

    const monitoringSubmitButton = screen.getByRole("button", {
      name: /confirm/i,
    });
    expect(monitoringSubmitButton).toBeInTheDocument();

    await userEvent.click(monitoringSubmitButton);

    await waitFor(async () => {
      expect(
        await screen.findByText(editMonitorSuccessMsg)
      ).toBeInTheDocument();
    });

    //eslint error occurs if multiple assertions are placed in waitFor
    expect(await screen.findByText(startQueueSuccessMsg)).toBeInTheDocument();
  });

  test("can delete a monitor", async () => {
    // wait for monitor to be fetched
    await waitFor(async () => {
      await renderApp({ route: monitoringRoute, useMockMonitor: true });
    });

    const monitorSettingOptions = screen.getByRole("combobox", {
      name: /Monitoring Setting/i,
    });

    const monitorSettingOffOption = screen.getByRole("option", {
      name: MonitorSettingOptions.OFF,
      //eslint-disable-next-line
    }) as any;

    await userEvent.selectOptions(
      monitorSettingOptions,
      monitorSettingOffOption
    );

    expect(monitorSettingOffOption.selected).toBe(true);

    await waitFor(async () => {
      expect(
        await screen.findByText(deleteMonitorSuccessMsg)
      ).toBeInTheDocument();
    });

    //eslint error occurs if multiple assertions are placed in waitFor
    expect(await screen.findByText(removeQueueSuccessMsg)).toBeInTheDocument();
  });

  test("can create a monitor", async () => {
    // wait for monitor to be fetched
    await waitFor(async () => {
      await renderApp({ route: monitoringRoute, useMockMonitor: false });
    });

    const monitorSettingOptions = screen.getByRole("combobox", {
      name: /Monitoring Setting/i,
    });

    const monitorSettingOnOption = screen.getByRole("option", {
      name: MonitorSettingOptions.ON,
      //eslint-disable-next-line
    }) as any;

    await userEvent.selectOptions(
      monitorSettingOptions,
      monitorSettingOnOption
    );

    expect(monitorSettingOnOption.selected).toBe(true);

    const monitoringSubmitButton = screen.getByRole("button", {
      name: /confirm/i,
    });
    expect(monitoringSubmitButton).toBeInTheDocument();

    await userEvent.click(monitoringSubmitButton);

    await waitFor(async () => {
      expect(
        await screen.findByText(createMonitorSuccessMsg)
      ).toBeInTheDocument();
    });
  });
});
