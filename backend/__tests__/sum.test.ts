import sum from "../sum";

describe("adding numbers, and seeing if importing functions/modules work", () => {
  it("should equal to result", () => {
    expect(sum(1, 2)).toEqual(3);
  });
});
