import { redisConfiguration } from "controllers/queueController";
import sum from "test/sum";

describe("adding numbers, and testing if importing functions/modules work", () => {
  afterAll(async () => {
    //use this to prevent memory leaks
    await redisConfiguration.connection.quit();
  });
  it("should equal to result", () => {
    expect(sum(1, 2)).toEqual(3);
  });
});
