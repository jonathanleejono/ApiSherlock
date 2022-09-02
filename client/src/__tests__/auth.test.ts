import { baseUrl } from "constants/apiUrls";
import { getToken, setToken } from "constants/token";
import { newAccessToken } from "test/mocks/handlers";
import { PathParams, rest, RestRequest, server } from "test/mocks/server";
import customFetch from "utils/axios";

const endpoint = "/test-endpoint";
const mockResult = { mockValue: "VALUE" };
const accessToken = "FAKE_TOKEN";

let request: RestRequest<never, PathParams<string>>;

describe("testing MSW server and auth setup", () => {
  test("adds token when an accessToken is provided", async () => {
    setToken(accessToken);

    // this mock api response must come before customFetch/axios fetches
    server.use(
      rest.get(`${baseUrl}${endpoint}`, async (req, res, ctx) => {
        request = req;
        return res(ctx.json(mockResult));
      })
    );

    // the baseUrl above in rest.get(`${baseUrl}${endpoint}`)
    // must match the baseUrl in customFetch/axios
    await customFetch.get(endpoint);

    expect(request.headers.get("Authorization")).toBe(`Bearer ${accessToken}`);

    setToken(null); //reset token
  });

  test("refresh token activates when no accessToken is provided", async () => {
    const emptyToken = await getToken();

    expect(emptyToken).toBeNull();

    // this mock api response must come before customFetch/axios fetches
    server.use(
      rest.get(`${baseUrl}${endpoint}`, async (req, res, ctx) => {
        request = req;
        return res(ctx.json(mockResult));
      })
    );

    await customFetch.get(endpoint);

    expect(request.headers.get("Authorization")).toBe(
      `Bearer ${newAccessToken}`
    );
  });
});
