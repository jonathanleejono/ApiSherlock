"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validKeys = void 0;
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
//# sourceMappingURL=validateKeys.js.map