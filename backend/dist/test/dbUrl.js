"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDbUrl = void 0;
const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_PORT } = process.env;
const createDbUrl = (customDBName) => `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@localhost:${MONGODB_PORT}/${customDBName}?authMechanism=DEFAULT&authSource=admin`;
exports.createDbUrl = createDbUrl;
//# sourceMappingURL=dbUrl.js.map