import "@testing-library/jest-dom/extend-expect";
import { allApisKey, tokenKey, usersKey } from "constants/keys";
import * as apisDB from "test/data/apisDb";
import * as usersDB from "test/data/usersDb";
import { server } from "test/mocks/server";
import * as ResizeObserverModule from "resize-observer-polyfill";

global.ResizeObserver = ResizeObserverModule.default;

jest.setTimeout(10000);

beforeAll(() => {
  // Enable the mocking in tests.
  // bypass to ignore pingAll/pingOne axios fetches
  server.listen({ onUnhandledRequest: "bypass" });
  localStorage.removeItem(usersKey);
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(allApisKey);
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(async () => {
  // Clean up once the tests are done.
  server.close();
  localStorage.removeItem(usersKey);
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(allApisKey);
  // depending on the test, DBs may need to be
  // reset in an afterEach instead of afterAll
  await Promise.all([usersDB.resetDB(), apisDB.resetDB()]);
});
