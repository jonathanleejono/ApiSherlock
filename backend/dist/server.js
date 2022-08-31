"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("constants/messages");
const urls_1 = require("constants/urls");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const connect_1 = __importDefault(require("db/connect"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
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
if (process.env.NODE_ENV !== "production") {
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
app.use((0, cookie_parser_1.default)());
app.use(urls_1.pingHealthCheckUrl, (_, res) => {
    res.send(messages_1.pingHealthCheckSuccessMsg);
});
app.use(`${urls_1.baseAuthUrl}`, authRoutes_1.default);
app.use(`${urls_1.baseApiUrl}`, authenticateUser_1.default, apiRoutes_1.default);
app.use(`${urls_1.baseMonitorUrl}`, authenticateUser_1.default, monitorRoutes_1.default);
app.use(`${urls_1.baseQueueUrl}`, authenticateUser_1.default, queueRoutes_1.default);
if (process.env.NODE_ENV === "test") {
    app.use(`${urls_1.baseSeedDbUrl}`, seedDbRoutes_1.default);
}
app.use(notFoundRoute_1.default);
app.use(errorHandler_1.default);
const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await (0, connect_1.default)(process.env.MONGO_URL);
        if (process.env.NODE_ENV !== "test") {
            app.listen(port, () => {
                console.log(`Server is listening on port ${port}...`);
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};
start();
exports.default = app;
//# sourceMappingURL=server.js.map