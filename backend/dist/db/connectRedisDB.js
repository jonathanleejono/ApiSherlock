"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envVars_1 = require("constants/envVars");
const ioredis_1 = __importDefault(require("ioredis"));
const connectRedisDB = async () => {
    const redisConfiguration = {
        connection: new ioredis_1.default({
            host: envVars_1.REDIS_HOST,
            port: parseInt(envVars_1.REDIS_PORT),
            username: envVars_1.PROD_ENV ? envVars_1.REDIS_USERNAME : undefined,
            password: envVars_1.PROD_ENV ? envVars_1.REDIS_PASSWORD : undefined,
            maxRetriesPerRequest: null,
        }),
    };
    return redisConfiguration;
};
exports.default = connectRedisDB;
//# sourceMappingURL=connectRedisDB.js.map