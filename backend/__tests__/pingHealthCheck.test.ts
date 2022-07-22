import app from "../server";
import request from "supertest";
import mongoose from "mongoose";

describe("seeing if supertest and jest works", () => {
  afterAll(async () => {
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();
  });
  it("should ping server", async () => {
    const res = await request(app).get("/api/ping");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("hello world!");
  });
});
