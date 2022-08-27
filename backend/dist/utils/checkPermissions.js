"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("errors/index");
const checkPermissions = (res, requestUserId, resourceUserId) => {
    if (requestUserId.toString() !== resourceUserId.toString()) {
        (0, index_1.unAuthenticatedError)(res, "Not authorized to access");
        return;
    }
    else
        return;
};
exports.default = checkPermissions;
//# sourceMappingURL=checkPermissions.js.map