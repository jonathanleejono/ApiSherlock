import "@testing-library/jest-dom/extend-expect";
import * as listItemsDB from "test/mocks/listItemsDb";
import * as usersDB from "test/mocks/usersDb";
import { server } from "test/server/server";

jest.setTimeout(10000);

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen({ onUnhandledRequest: "bypass" });
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("__allApis__");
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("__allApis__");
});

// general cleanup
afterEach(async () => {
  await Promise.all([usersDB.resetDB(), listItemsDB.resetDB()]);
});
