"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentDayYear = void 0;
const moment_1 = __importDefault(require("moment"));
exports.currentDayYear = (0, moment_1.default)(Date.now()).format("MMM Do YYYY");
//# sourceMappingURL=datetime.js.map