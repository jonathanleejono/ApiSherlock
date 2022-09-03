import { redisConfiguration } from "controllers/queueController";
import { closeServer } from "server";
import sum from "test/sum";

describe("adding numbers, and testing if importing functions/modules work", () => {
  afterAll(async () => {
    //all of this is to prevent memory leaks
    await redisConfiguration.connection.quit();
    closeServer();
  });
  it("should equal to result", () => {
    expect(sum(1, 2)).toEqual(3);
  });
});
