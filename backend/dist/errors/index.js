"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundError = exports.forbiddenError = exports.unAuthenticatedError = exports.badRequestError = void 0;
const http_status_codes_1 = require("http-status-codes");
const badRequestError = (res, msg) => {
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: `${msg}` });
};
exports.badRequestError = badRequestError;
const unAuthenticatedError = (res, msg) => {
    res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: `${msg}` });
};
exports.unAuthenticatedError = unAuthenticatedError;
const forbiddenError = (res, msg) => {
    res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ error: `${msg}` });
};
exports.forbiddenError = forbiddenError;
const notFoundError = (res, msg) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: `${msg}` });
};
exports.notFoundError = notFoundError;
//# sourceMappingURL=index.js.map