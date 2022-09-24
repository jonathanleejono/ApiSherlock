"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidationResult = exports.createValidationFor = void 0;
const apiUrls_1 = require("constants/apiUrls");
const express_validator_1 = require("express-validator");
function createValidationFor(route) {
    switch (route) {
        case apiUrls_1.registerUserUrl:
            return [
                (0, express_validator_1.check)("email").isEmail().withMessage("Please enter a valid email"),
                (0, express_validator_1.check)("password")
                    .isLength({ min: 6 })
                    .withMessage("Please enter a password at least 6 characters long"),
            ];
        case apiUrls_1.authUserUrl:
            return [
                (0, express_validator_1.body)("email")
                    .optional()
                    .isEmail()
                    .withMessage("Please enter a valid email"),
            ];
        default:
            return [];
    }
}
exports.createValidationFor = createValidationFor;
function checkValidationResult(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        return next();
    }
    const errors = result.array();
    const errMsg = errors[0].msg;
    res.status(400).json({ error: errMsg });
}
exports.checkValidationResult = checkValidationResult;
//# sourceMappingURL=expressValidator.js.map