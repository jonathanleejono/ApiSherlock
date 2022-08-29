"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validGetAllApisKeys = exports.validUpdateApiKeys = exports.validCreateApiKeys = exports.validUpdateKeys = exports.validLoginKeys = exports.validRegisterKeys = void 0;
const mockApi_1 = require("mocks/mockApi");
const mockUser_1 = require("mocks/mockUser");
const { name, email, password, timezoneGMT } = mockUser_1.mockUser;
exports.validRegisterKeys = Object.keys(mockUser_1.mockUser);
exports.validLoginKeys = Object.keys({ email, password });
exports.validUpdateKeys = Object.keys({ name, email, timezoneGMT });
exports.validCreateApiKeys = Object.keys(mockApi_1.mockApi);
exports.validUpdateApiKeys = exports.validCreateApiKeys;
exports.validGetAllApisKeys = [
    "status",
    "monitoring",
    "sort",
    "search",
    "page",
    "limit",
    "search",
];
//# sourceMappingURL=keys.js.map