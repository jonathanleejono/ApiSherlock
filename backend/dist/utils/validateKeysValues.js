"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyValuesExist = exports.validValues = exports.validKeys = exports.validFieldsFormatted = void 0;
const errors_1 = require("errors");
function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length;
}
function validFieldsFormatted(validFields) {
    return `${validFields}`.replace(/,/g, ", ");
}
exports.validFieldsFormatted = validFieldsFormatted;
function validKeys(res, inputArray, errorMsg, validFields) {
    const validFields_ = validFieldsFormatted(validFields);
    if (!inputArray.every((elem) => validFields.includes(elem))) {
        (0, errors_1.badRequestError)(res, `${errorMsg}` + validFields_);
        return false;
    }
    if (checkIfDuplicateExists(inputArray)) {
        (0, errors_1.badRequestError)(res, `Duplicate fields, please only provide one of each: ${validFields_}`);
        return false;
    }
    return true;
}
exports.validKeys = validKeys;
function validValues(res, reqInput, errorMsg, validOptions, labelValidOptions) {
    if (labelValidOptions) {
        if (!validOptions.includes(reqInput)) {
            (0, errors_1.badRequestError)(res, `${errorMsg}` + validFieldsFormatted(labelValidOptions));
            return false;
        }
    }
    if (!validOptions.includes(reqInput)) {
        (0, errors_1.badRequestError)(res, `${errorMsg}` + validFieldsFormatted(validOptions));
        return false;
    }
    return true;
}
exports.validValues = validValues;
function emptyValuesExist(res, arr) {
    if (!arr.every((element) => element !== null && element !== undefined && element !== "")) {
        (0, errors_1.badRequestError)(res, "Please fill out all values");
        return true;
    }
    return false;
}
exports.emptyValuesExist = emptyValuesExist;
//# sourceMappingURL=validateKeysValues.js.map