import "@testing-library/jest-dom/extend-expect";
import { setToken } from "constants/token";
import * as ResizeObserverModule from "resize-observer-polyfill";
import * as apisDB from "test/data/apisDb";
import * as monitorDB from "test/data/monitorDb";
import * as queueDB from "test/data/queueDb";
import {
  testAllApisKey,
  testMonitorKey,
  testQueueKey,
  testUserKey,
} from "test/data/testKeys";
import * as usersDB from "test/data/usersDb";
import { server } from "test/mocks/server";

global.ResizeObserver = ResizeObserverModule.default;

jest.setTimeout(10000);

beforeAll(() => {
  // Enable the mocking in tests.
  // Bypass to ignore pingAll/pingOne axios url fetches
  server.listen({ onUnhandledRequest: "bypass" });
  localStorage.removeItem(testUserKey);
  localStorage.removeItem(testAllApisKey);
  localStorage.removeItem(testMonitorKey);
  localStorage.removeItem(testQueueKey);
  localStorage.removeItem("MSW_COOKIE_STORE");
});

afterEach(async () => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(async () => {
  // Clean up once the tests are done.
  server.close();
  await Promise.all([
    usersDB.resetDB(),
    apisDB.resetDB(),
    monitorDB.resetDB(),
    queueDB.resetDB(),
  ]);
  localStorage.removeItem(testUserKey);
  localStorage.removeItem(testAllApisKey);
  localStorage.removeItem(testMonitorKey);
  localStorage.removeItem(testQueueKey);
  localStorage.removeItem("MSW_COOKIE_STORE");
  setToken(null);
});
