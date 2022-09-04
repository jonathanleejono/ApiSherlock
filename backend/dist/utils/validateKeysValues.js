"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyValuesExist = exports.validValues = exports.validKeys = void 0;
const errors_1 = require("errors");
function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length;
}
function validKeys(res, arrReqInput, errorMsg, arrValid) {
    if (!arrReqInput.every((elem) => arrValid.includes(elem))) {
        (0, errors_1.badRequestError)(res, `${errorMsg}` + `${arrValid}`.replace(/,/g, ", "));
        return false;
    }
    else if (checkIfDuplicateExists(arrReqInput)) {
        (0, errors_1.badRequestError)(res, `Duplicate info, please only provide one of each field`);
        return false;
    }
    return true;
}
exports.validKeys = validKeys;
function validValues(res, reqInput, errorMsg, validOptions, labelValidOptions) {
    if (labelValidOptions) {
        if (!validOptions.includes(reqInput)) {
            (0, errors_1.badRequestError)(res, `${errorMsg}` + `${labelValidOptions}`.replace(/,/g, ", "));
            return false;
        }
    }
    if (!validOptions.includes(reqInput)) {
        (0, errors_1.badRequestError)(res, `${errorMsg}` + `${validOptions}`.replace(/,/g, ", "));
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