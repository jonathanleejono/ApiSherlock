import { badRequestError } from "errors";
import { Response } from "express";

function checkIfDuplicateExists(arr: Array<string | number>): boolean {
  // this returns true if duplicates exist
  return new Set(arr).size !== arr.length;
}

export function validFieldsFormatted(validFields: string[] | number[]) {
  return `${validFields}`.replace(/,/g, ", ");
}

export function validKeys(
  res: Response,
  inputArray: string[],
  errorMsg: string,
  validFields: string[]
): boolean {
  const validFields_ = validFieldsFormatted(validFields);

  if (!inputArray.every((elem) => validFields.includes(elem))) {
    badRequestError(res, `${errorMsg}` + validFields_);
    return false;
  }

  if (checkIfDuplicateExists(inputArray)) {
    badRequestError(
      res,
      `Duplicate fields, please only provide one of each: ${validFields_}`
    );
    return false;
  }

  return true;
}

export function validValues(
  res: Response,
  reqInput: string | number,
  errorMsg: string,
  validOptions: any[],
  labelValidOptions?: any[]
): boolean {
  // labelValidOptions is if the frontend's
  // values are different from the backend
  if (labelValidOptions) {
    if (!validOptions.includes(reqInput)) {
      badRequestError(
        res,
        `${errorMsg}` + validFieldsFormatted(labelValidOptions)
      );
      return false;
    }
  }

  if (!validOptions.includes(reqInput)) {
    badRequestError(res, `${errorMsg}` + validFieldsFormatted(validOptions));
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
