import { baseUrl } from "constants/urls";
import { PathParams, rest, RestRequest, server } from "test/server/server";
import customFetch from "utils/axios";

// this endpoint needs to be a real route
const endpoint = "/ping";
const mockResult = { mockValue: "VALUE" };
const token = "FAKE_TOKEN";

let request: RestRequest<never, PathParams<string>>;

describe("testing MSW server and auth setup", () => {
  test("adds auth token when a token is provided", async () => {
    // "window" suffix isn't necessary, but can be left as reference
    window.localStorage.setItem("token", token);

    // this mock api response must come before client/customFetch fetches
    server.use(
      rest.get(`${baseUrl}${endpoint}`, async (req, res, ctx) => {
        request = req;
        return res(ctx.json(mockResult));
      })
    );

    await customFetch.get(endpoint);

    expect(request.headers.get("Authorization")).toBe(`Bearer ${token}`);
  });
});
