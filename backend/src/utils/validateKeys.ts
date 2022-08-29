import { badRequestError } from "errors";
import { Response } from "express";

function checkIfDuplicateExists(arr: string[]): boolean {
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
