const arrValid = ["name", "email", "password", "timezoneGMT"];
const arrReqInput = ["name", "email", "password", "timezoneGMT", "bad"];
function validArrKeys(arrReqInput, arrValid) {
    if (!arrReqInput.every((elem) => arrValid.includes(elem)))
        return false;
    else
        return true;
}
console.log(validArrKeys(arrReqInput, arrValid));
function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length;
}
var arr = ["a", "a", "b", "c"];
var arr1 = ["a", "b", "c"];
console.log(checkIfDuplicateExists(arr));
console.log(checkIfDuplicateExists(arr1));
//# sourceMappingURL=test2.js.map