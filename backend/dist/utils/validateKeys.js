"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInputKeys = void 0;
const errors_1 = require("errors");
let inputKeys;
function validateInputKeys(req, res, errorMsg, validKeys, keyType) {
    if (keyType === "query") {
        inputKeys = req.query;
    }
    else
        inputKeys = req.body;
    Object.keys(inputKeys).forEach((key) => {
        if (!validKeys.includes(key)) {
            (0, errors_1.badRequestError)(res, `${errorMsg}` + `${validKeys}`.replace(/,/g, ", "));
        }
    });
    return;
}
exports.validateInputKeys = validateInputKeys;
//# sourceMappingURL=validateKeys.js.map