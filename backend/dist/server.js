"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrls_1 = require("constants/apiUrls");
const envVars_1 = require("constants/envVars");
const messages_1 = require("constants/messages");
const cors_1 = __importDefault(require("cors"));
const connectMongoose_1 = __importDefault(require("db/connectMongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const envalid_1 = require("envalid");
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const get_port_1 = __importDefault(require("get-port"));
const helmet_1 = __importDefault(require("helmet"));
const authenticateUser_1 = __importDefault(require("middleware/authenticateUser"));
const errorHandler_1 = __importDefault(require("middleware/errorHandler"));
const notFoundRoute_1 = __importDefault(require("middleware/notFoundRoute"));
const morgan_1 = __importDefault(require("morgan"));
const apiRoutes_1 = __importDefault(require("routes/apiRoutes"));
const authRoutes_1 = __importDefault(require("routes/authRoutes"));
const monitorRoutes_1 = __importDefault(require("routes/monitorRoutes"));
const queueRoutes_1 = __importDefault(require("routes/queueRoutes"));
const seedDbRoutes_1 = __importDefault(require("routes/seedDbRoutes"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const validateStr = (0, envalid_1.makeValidator)((x) => {
    if (!x)
        throw new Error("Value is empty");
    else
        return (0, envalid_1.str)();
});
const validateEnv = (0, envalid_1.makeValidator)((x) => {
    if (!x)
        throw new Error("Value is empty");
    else
        return (0, envalid_1.str)({ choices: ["development", "test", "production", "staging"] });
});
const validateCI = (0, envalid_1.makeValidator)((x) => {
    if (!x)
        throw new Error("Value is empty");
    else
        return (0, envalid_1.str)({ choices: ["no", "yes"] });
});
(0, envalid_1.cleanEnv)(process.env, {
    MONGO_URL: validateStr(),
    JWT_SECRET: validateStr(),
    JWT_ACCESS_TOKEN_LIFETIME: validateStr(),
    NODE_ENV: validateEnv(),
    CORS_ORIGIN: validateStr(),
    REDIS_HOST: validateStr(),
    REDIS_PORT: (0, envalid_1.port)(),
    USING_CI: validateCI(),
});
if (envVars_1.PROD_ENV) {
    (0, envalid_1.cleanEnv)(process.env, {
        REDIS_USERNAME: validateStr(),
        REDIS_PASSWORD: validateStr(),
    });
}
if (!envVars_1.PROD_ENV) {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, xss_clean_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, cors_1.default)({
    origin: [process.env.CORS_ORIGIN],
    credentials: true,
}));
app.use(apiUrls_1.pingHealthCheckUrl, (_, res) => {
    res.send(messages_1.pingHealthCheckSuccessMsg);
});
app.use(`${apiUrls_1.baseAuthUrl}`, authRoutes_1.default);
app.use(`${apiUrls_1.baseApiUrl}`, authenticateUser_1.default, apiRoutes_1.default);
app.use(`${apiUrls_1.baseMonitorUrl}`, authenticateUser_1.default, monitorRoutes_1.default);
app.use(`${apiUrls_1.baseQueueUrl}`, authenticateUser_1.default, queueRoutes_1.default);
if (envVars_1.TEST_ENV) {
    app.use(`${apiUrls_1.baseSeedDbUrl}`, seedDbRoutes_1.default);
}
app.use(notFoundRoute_1.default);
app.use(errorHandler_1.default);
let serverPort = parseInt(process.env.PORT) || 5000;
const start = async () => {
    try {
        if (envVars_1.PROD_ENV) {
            serverPort = await (0, get_port_1.default)({ port: 5000 });
        }
        if (!envVars_1.TEST_ENV) {
            app.listen(serverPort, async () => {
                console.log(`Server is listening on port ${serverPort}...`);
            });
            await (0, connectMongoose_1.default)(process.env.MONGO_URL);
        }
    }
    catch (error) {
        console.log(error);
        throw new Error("Error starting app");
    }
};
start();
exports.default = app;
//# sourceMappingURL=server.js.map