"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResult = void 0;
const express_validator_1 = require("express-validator");
function validateResult(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        return next();
    }
    const errors = result.array();
    const errMsg = errors[0].msg;
    res.status(400).json({ error: errMsg });
}
exports.validateResult = validateResult;
//# sourceMappingURL=expressValidatorResult.js.map