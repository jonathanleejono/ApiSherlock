"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queueController_1 = require("controllers/queueController");
describe("subtracting numbers, and testing if jest works", () => {
    afterAll(async () => {
        await queueController_1.redisConfiguration.connection.quit();
    });
    it("should equal to result", () => {
        expect(1 - 2).toEqual(-1);
    });
});
//# sourceMappingURL=subtract.test.js.map