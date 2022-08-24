import app from "server";
import request from "supertest";
import mongoose from "mongoose";
import { pingHealthCheckUrl } from "constants/urls";
import { pingHealthCheckSuccessMsg } from "constants/messages";

describe("testing if supertest and jest works", () => {
  afterAll(async () => {
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();
  });
  it("should ping server", async () => {
    const res = await request(app).get(pingHealthCheckUrl);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(pingHealthCheckSuccessMsg);
  });
});
