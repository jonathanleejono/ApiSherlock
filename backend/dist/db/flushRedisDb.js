"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectRedisDB_1 = __importDefault(require("db/connectRedisDB"));
const flushRedisDB = async () => {
    const redisConfiguration = await (0, connectRedisDB_1.default)();
    await redisConfiguration.connection.flushall();
    await redisConfiguration.connection.quit();
    await new Promise((res) => setTimeout(res, 1000));
};
exports.default = flushRedisDB;
//# sourceMappingURL=flushRedisDb.js.map