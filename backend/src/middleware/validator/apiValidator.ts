import { createApiUrl, editApiUrl, getAllApisUrl } from "constants/apiUrls";
import {
  validApiHostOptions,
  validApiMonitoringOptions,
  validApiStatusOptions,
} from "constants/options/apis";
import { body, query } from "express-validator";
import { validFieldsFormatted } from "utils/validateKeysValues";

export function apiValidator(route: string) {
  switch (route) {
    case createApiUrl:
      return [
        body("url").isURL().withMessage("Please enter a valid URL"),
        body("host")
          .isIn(validApiHostOptions)
          .withMessage(
            `Invalid host, must be one of: ${validFieldsFormatted(
              validApiHostOptions
            )} `
          ),
        body("monitoring")
          .isIn(validApiMonitoringOptions)
          .withMessage(
            `Invalid monitoring setting, must be one of: ${validFieldsFormatted(
              validApiMonitoringOptions
            )} `
          ),
      ];
    case editApiUrl:
      return [
        body("url").optional().isURL().withMessage("Please enter a valid URL"),
        body("host")
          .optional()
          .isIn(validApiHostOptions)
          .withMessage(
            `Invalid host, must be one of: ${validFieldsFormatted(
              validApiHostOptions
            )} `
          ),
        body("monitoring")
          .optional()
          .isIn(validApiMonitoringOptions)
          .withMessage(
            `Invalid monitoring setting, must be one of: ${validFieldsFormatted(
              validApiMonitoringOptions
            )} `
          ),
      ];
    case getAllApisUrl:
      return [
        query("host")
          .optional()
          .isIn([...validApiHostOptions, "All"])
          .withMessage(
            `Invalid host search, must be one of: ${validFieldsFormatted([
              ...validApiHostOptions,
              "All",
            ])}`
          ),
        query("status")
          .optional()
          .isIn([...validApiStatusOptions, "All"])
          .withMessage(
            `Invalid status search, must be one of: ${validFieldsFormatted([
              ...validApiStatusOptions,
              "All",
            ])}`
          ),
        query("monitoring")
          .optional()
          .isIn([...validApiMonitoringOptions, "All"])
          .withMessage(
            `Invalid monitoring search, must be one of: ${validFieldsFormatted([
              ...validApiMonitoringOptions,
              "All",
            ])}`
          ),
        query("search")
          .optional()
          .isString()
          .withMessage(`Please enter valid search`),
      ];
    default:
      return [];
  }
}
