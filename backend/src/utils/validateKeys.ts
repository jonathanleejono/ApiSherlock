import { badRequestError } from "errors";
import { Request, Response } from "express";

let inputKeys;

export function validateInputKeys(
  req: Request,
  res: Response,
  errorMsg: string,
  validKeys: string[],
  keyType?: "query" | "body"
) {
  if (keyType === "query") {
    inputKeys = req.query;
  } else inputKeys = req.body;

  Object.keys(inputKeys).forEach((key: string) => {
    if (!validKeys.includes(key)) {
      badRequestError(res, `${errorMsg}` + `${validKeys}`.replace(/,/g, ", "));
    }
  });
  return;
}
