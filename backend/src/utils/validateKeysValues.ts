import { badRequestError } from "errors";
import { Response } from "express";

function checkIfDuplicateExists(arr: Array<string | number>): boolean {
  // this returns true if duplicates exist
  return new Set(arr).size !== arr.length;
}

export function validKeys(
  res: Response,
  arrReqInput: string[],
  errorMsg: string,
  arrValid: string[]
): boolean {
  if (!arrReqInput.every((elem) => arrValid.includes(elem))) {
    badRequestError(res, `${errorMsg}` + `${arrValid}`.replace(/,/g, ", "));
    return false;
  } else if (checkIfDuplicateExists(arrReqInput)) {
    badRequestError(
      res,
      `Duplicate info, please only provide one of each field`
    );
    return false;
  }
  return true;
}

export function validValues(
  res: Response,
  reqInput: string | number,
  errorMsg: string,
  validOptions: any[]
): boolean {
  if (!validOptions.includes(reqInput)) {
    badRequestError(res, `${errorMsg}` + `${validOptions}`.replace(/,/g, ", "));
    return false;
  }
  return true;
}

// if not every element is not null or undefined or "",
// ie. if any element is null or undefined or "", return error
// some values in models may be false, which is why a
// catch all "element !== false" is not used
export function emptyValuesExist(res: Response, arr: Array<any>): boolean {
  if (
    !arr.every(
      (element) => element !== null && element !== undefined && element !== ""
    )
  ) {
    badRequestError(res, "Please fill out all values");
    return true;
  }
  return false;
}
