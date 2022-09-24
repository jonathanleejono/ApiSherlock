"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidator = void 0;
const apiUrls_1 = require("constants/apiUrls");
const timezoneOffsets_1 = require("constants/options/timezoneOffsets");
const express_validator_1 = require("express-validator");
const validateKeysValues_1 = require("utils/validateKeysValues");
function authValidator(route) {
    switch (route) {
        case apiUrls_1.registerUserUrl:
            return [
                (0, express_validator_1.body)("name")
                    .isString()
                    .isLength({ min: 1 })
                    .withMessage("Please enter a name")
                    .isLength({ max: 30 })
                    .withMessage("Please enter a name no more than 30 characters"),
                (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email"),
                (0, express_validator_1.body)("password")
                    .isLength({ min: 6 })
                    .withMessage("Please enter a password at least 6 characters long")
                    .isLength({ max: 255 })
                    .withMessage("Please enter a password no more than 255 characters"),
                (0, express_validator_1.body)("timezoneGMT")
                    .isIn(timezoneOffsets_1.timezoneOffsets)
                    .withMessage(`Invalid timezone, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(timezoneOffsets_1.timezoneOffsets)} `)
                    .isNumeric(),
            ];
        case apiUrls_1.loginUserUrl:
            return [
                (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email"),
                (0, express_validator_1.body)("password").isString().withMessage("Please enter a password"),
            ];
        case apiUrls_1.authUserUrl:
            return [
                (0, express_validator_1.body)("name")
                    .optional()
                    .isString()
                    .isLength({ min: 1 })
                    .withMessage("Please enter a name")
                    .isLength({ max: 30 })
                    .withMessage("Please enter a name no more than 30 characters"),
                (0, express_validator_1.body)("email")
                    .optional()
                    .isEmail()
                    .withMessage("Please enter a valid email"),
                (0, express_validator_1.body)("timezoneGMT")
                    .optional()
                    .isIn(timezoneOffsets_1.timezoneOffsets)
                    .withMessage(`Invalid timezone, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(timezoneOffsets_1.timezoneOffsets)} `)
                    .isNumeric(),
            ];
        default:
            return [];
    }
}
exports.authValidator = authValidator;
//# sourceMappingURL=authValidator.js.map