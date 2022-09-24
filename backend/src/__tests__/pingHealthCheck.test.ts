import { pingHealthCheckUrl } from "constants/apiUrls";
import { pingHealthCheckSuccessMsg } from "constants/messages";
import closeMongoose from "db/closeMongoose";
import connectMongoose from "db/connectMongoose";
import app from "server";
import request from "supertest";
import { createDbUrl } from "test/dbUrl";

const databaseName = "test-ping";

let url = `mongodb://127.0.0.1/${databaseName}`;

if (process.env.USING_CI === "yes") {
  url = createDbUrl(databaseName);
}

describe("testing if supertest and jest works", () => {
  beforeAll(async () => {
    await connectMongoose(url);
  });
  afterAll(async () => {
    await closeMongoose();
  });
  it("should ping server", async () => {
    const res = await request(app).get(pingHealthCheckUrl);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(pingHealthCheckSuccessMsg);
  });
});
