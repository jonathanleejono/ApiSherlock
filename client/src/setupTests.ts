import "@testing-library/jest-dom/extend-expect";
import { testAllApisKey, testUserKey } from "constants/keys";
import { setToken } from "constants/token";
import * as ResizeObserverModule from "resize-observer-polyfill";
import * as apisDB from "test/data/apisDb";
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
});

afterEach(async () => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
  await Promise.all([usersDB.resetDB(), apisDB.resetDB()]);
});

afterAll(async () => {
  // Clean up once the tests are done.
  server.close();
  localStorage.removeItem(testUserKey);
  localStorage.removeItem(testAllApisKey);
  localStorage.removeItem("MSW_COOKIE_STORE");
  setToken(null);
});
