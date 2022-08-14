"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validGetAllApisKeys = exports.validUpdateApiKeys = exports.validCreateApiKeys = exports.validUpdateKeys = exports.validLoginKeys = exports.validRegisterKeys = void 0;
exports.validRegisterKeys = ["name", "email", "password"];
exports.validLoginKeys = ["email", "password"];
exports.validUpdateKeys = ["name", "email"];
exports.validCreateApiKeys = ["url", "host", "monitoring"];
exports.validUpdateApiKeys = [...exports.validCreateApiKeys];
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