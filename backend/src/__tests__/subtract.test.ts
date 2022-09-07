import { redisConfiguration } from "controllers/queueController";

describe("subtracting numbers, and testing if jest works", () => {
  afterAll(async () => {
    //use this to prevent memory leaks
    await redisConfiguration.connection.quit();
  });

  it("should equal to result", () => {
    expect(1 - 2).toEqual(-1);
  });
});
