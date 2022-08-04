import { baseUrl } from "constants/urls";
import { PathParams, rest, RestRequest, server } from "test/mocks/server";
import customFetch from "utils/axios";

const endpoint = "/test-endpoint";
const mockResult = { mockValue: "VALUE" };
const token = "FAKE_TOKEN";

let request: RestRequest<never, PathParams<string>>;

describe("testing MSW server and auth setup", () => {
  test("adds auth token when a token is provided", async () => {
    // "window" suffix isn't necessary, but can be left as reference
    window.localStorage.setItem("token", token);

    // this mock api response must come before customFetch/axios fetches
    server.use(
      rest.get(`${baseUrl}${endpoint}`, async (req, res, ctx) => {
        request = req;
        return res(ctx.json(mockResult));
      })
    );

    // the baseUrl in rest.get(`${baseUrl}${endpoint}`)
    // must match the baseUrl in customFetch/axios
    await customFetch.get(endpoint);

    expect(request.headers.get("Authorization")).toBe(`Bearer ${token}`);
  });
});
