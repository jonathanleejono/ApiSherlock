import { authUserUrl, loginUserUrl, registerUserUrl } from "constants/apiUrls";
import { timezoneOffsets } from "constants/options/timezoneOffsets";
import { body } from "express-validator";
import { validFieldsFormatted } from "utils/validateKeysValues";

export function authValidator(route: string) {
  switch (route) {
    case registerUserUrl:
      return [
        body("name")
          .isString()
          .isLength({ min: 1 })
          .withMessage("Please enter a name")
          .isLength({ max: 30 })
          .withMessage("Please enter a name no more than 30 characters"),
        body("email").isEmail().withMessage("Please enter a valid email"),
        body("password")
          .isLength({ min: 6 })
          .withMessage("Please enter a password at least 6 characters long")
          .isLength({ max: 255 })
          .withMessage("Please enter a password no more than 255 characters"),
        body("timezoneGMT")
          .isIn(timezoneOffsets)
          .withMessage(
            `Invalid timezone, must be one of: ${validFieldsFormatted(
              timezoneOffsets
            )} `
          )
          .isNumeric(),
      ];
    case loginUserUrl:
      return [
        body("email").isEmail().withMessage("Please enter a valid email"),
        body("password").isString().withMessage("Please enter a password"),
      ];
    case authUserUrl:
      return [
        body("name")
          .optional()
          .isString()
          .isLength({ min: 1 })
          .withMessage("Please enter a name")
          .isLength({ max: 30 })
          .withMessage("Please enter a name no more than 30 characters"),
        body("email")
          .optional()
          .isEmail()
          .withMessage("Please enter a valid email"),
        body("timezoneGMT")
          .optional()
          .isIn(timezoneOffsets)
          .withMessage(
            `Invalid timezone, must be one of: ${validFieldsFormatted(
              timezoneOffsets
            )} `
          )
          .isNumeric(),
      ];
    default:
      return [];
  }
}
