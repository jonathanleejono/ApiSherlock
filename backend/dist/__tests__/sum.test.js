"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queueController_1 = require("controllers/queueController");
const sum_1 = __importDefault(require("test/sum"));
describe("adding numbers, and testing if importing functions/modules work", () => {
    afterAll(async () => {
        await queueController_1.redisConfiguration.connection.quit();
    });
    it("should equal to result", () => {
        expect((0, sum_1.default)(1, 2)).toEqual(3);
    });
});
//# sourceMappingURL=sum.test.js.map