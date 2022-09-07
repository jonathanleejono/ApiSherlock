import { redisConfiguration } from "controllers/queueController";
import { getCronUTCTime } from "utils/getCronUTCTime";

describe("testing if getCronUTCTime() converts time to GMT 0", () => {
  afterAll(async () => {
    //use this to prevent memory leaks
    await redisConfiguration.connection.quit();
  });

  it("should convert Tues 8:29 PM GMT -4 to Wed 12:29 AM GMT 0", async () => {
    expect(
      await getCronUTCTime({
        timezone: -4,
        inputDay: 2,
        inputHour: 20,
        inputMinute: 29,
      })
    ).toEqual("* 29 0 * * 3");
  });

  it("should convert Mon 3:58 AM GMT +7 to Sun 8:58 PM GMT 0", async () => {
    expect(
      await getCronUTCTime({
        timezone: +7,
        inputDay: 1,
        inputHour: 3,
        inputMinute: 58,
      })
    ).toEqual("* 58 20 * * 0");
  });

  it("should convert Mon 12:00PM GMT +13 to Sun 11:00 PM GMT 0", async () => {
    expect(
      await getCronUTCTime({
        timezone: +13,
        inputDay: 1,
        inputHour: 12,
        inputMinute: 0,
      })
    ).toEqual("* 0 23 * * 0");
  });
});
