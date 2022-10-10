"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiValidator = void 0;
const apiUrls_1 = require("constants/apiUrls");
const apis_1 = require("constants/options/apis");
const express_validator_1 = require("express-validator");
const validateKeysValues_1 = require("utils/validateKeysValues");
function apiValidator(route) {
    switch (route) {
        case apiUrls_1.createApiUrl:
            return [
                (0, express_validator_1.body)("url").isURL().withMessage("Please enter a valid URL"),
                (0, express_validator_1.body)("host")
                    .isIn(apis_1.validApiHostOptions)
                    .withMessage(`Invalid host, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(apis_1.validApiHostOptions)} `),
                (0, express_validator_1.body)("monitoring")
                    .isIn(apis_1.validApiMonitoringOptions)
                    .withMessage(`Invalid monitoring setting, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(apis_1.validApiMonitoringOptions)} `),
            ];
        case apiUrls_1.editApiUrl:
            return [
                (0, express_validator_1.body)("url").optional().isURL().withMessage("Please enter a valid URL"),
                (0, express_validator_1.body)("host")
                    .optional()
                    .isIn(apis_1.validApiHostOptions)
                    .withMessage(`Invalid host, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(apis_1.validApiHostOptions)} `),
                (0, express_validator_1.body)("monitoring")
                    .optional()
                    .isIn(apis_1.validApiMonitoringOptions)
                    .withMessage(`Invalid monitoring setting, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)(apis_1.validApiMonitoringOptions)} `),
            ];
        case apiUrls_1.getAllApisUrl:
            return [
                (0, express_validator_1.query)("host")
                    .optional()
                    .isIn([...apis_1.validApiHostOptions, "All", undefined])
                    .withMessage(`Invalid host search, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)([
                    ...apis_1.validApiHostOptions,
                    "All",
                ])}`),
                (0, express_validator_1.query)("status")
                    .optional()
                    .isIn([...apis_1.validApiStatusOptions, "All", undefined])
                    .withMessage(`Invalid status search, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)([
                    ...apis_1.validApiStatusOptions,
                    "All",
                ])}`),
                (0, express_validator_1.query)("monitoring")
                    .optional()
                    .isIn([...apis_1.validApiMonitoringOptions, "All", undefined])
                    .withMessage(`Invalid monitoring search, must be one of: ${(0, validateKeysValues_1.validFieldsFormatted)([
                    ...apis_1.validApiMonitoringOptions,
                    "All",
                ])}`),
                (0, express_validator_1.query)("search")
                    .optional()
                    .isString()
                    .withMessage(`Please enter valid search`),
            ];
        default:
            return [];
    }
}
exports.apiValidator = apiValidator;
//# sourceMappingURL=apiValidator.js.map