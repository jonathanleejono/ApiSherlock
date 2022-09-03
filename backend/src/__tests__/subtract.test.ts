import { redisConfiguration } from "controllers/queueController";
import { closeServer } from "server";

describe("subtracting numbers, and testing if jest works", () => {
  afterAll(async () => {
    //all of this is to prevent memory leaks
    await redisConfiguration.connection.quit();
    closeServer();
  });
  it("should equal to result", () => {
    expect(1 - 2).toEqual(-1);
  });
});
