"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundMiddleware = (_, res, next) => {
    res.status(404).json({ error: "Route does not exist" });
    next();
    return;
};
exports.default = notFoundMiddleware;
//# sourceMappingURL=notFoundRoute.js.map