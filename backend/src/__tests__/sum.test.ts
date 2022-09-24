import sum from "test/sum";

describe("adding numbers, and testing if importing functions/modules work", () => {
  it("should equal to result", () => {
    expect(sum(1, 2)).toEqual(3);
  });
});
