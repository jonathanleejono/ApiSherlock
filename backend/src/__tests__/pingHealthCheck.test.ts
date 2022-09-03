import { pingHealthCheckSuccessMsg } from "constants/messages";
import { pingHealthCheckUrl } from "constants/urls";
import { redisConfiguration } from "controllers/queueController";
import mongoose from "mongoose";
import app from "server";
import request from "supertest";

describe("testing if supertest and jest works", () => {
  beforeAll(async () => {
    const databaseName = "test-ping";
    const url = `mongodb://127.0.0.1/${databaseName}`;
    try {
      await mongoose.connect(url);
    } catch (error) {
      console.log("Error connecting to MongoDB/Mongoose: ", error);
    }
  });
  afterAll(async () => {
    //all of this is to prevent memory leaks
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();
    await redisConfiguration.connection.quit();
  });
  it("should ping server", async () => {
    const res = await request(app).get(pingHealthCheckUrl);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(pingHealthCheckSuccessMsg);
  });
});
