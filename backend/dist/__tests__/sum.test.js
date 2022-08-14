"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sum_1 = __importDefault(require("test/sum"));
describe("adding numbers, and testing if importing functions/modules work", () => {
    it("should equal to result", () => {
        expect((0, sum_1.default)(1, 2)).toEqual(3);
    });
});
//# sourceMappingURL=sum.test.js.map