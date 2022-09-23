import axios from "axios";
import {
  pingAllApisSuccessMsg,
  pingOneApiSuccessMsg,
} from "constants/messages";
import { ApiStatusOptions } from "enum/apis";
import { badRequestError, notFoundError, unAuthenticatedError } from "errors";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiCollection from "models/ApiCollection";
import checkPermissions from "utils/checkPermissions";
import { getDateWithUTCOffset } from "utils/datetime";
import validateUserExists from "utils/validateUserExists";

const pingAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const apis = await ApiCollection.find({
      createdBy: user._id,
    });

    if (!apis || !(apis.length > 0)) {
      notFoundError(res, `No APIs found`);
      return;
    }

    // using Promise.all() instead of .allSettled() works because
    // no result is returned, only an update is made

    await Promise.all(
      apis.map(async (api) => {
        axios
          .get(api.url)
          .then(() => {
            api.status = ApiStatusOptions.HEALTHY;
            api.lastPinged = getDateWithUTCOffset(user.timezoneGMT);

            api.save();
          })
          .catch(() => {
            api.status = ApiStatusOptions.UNHEALTHY;
            api.lastPinged = getDateWithUTCOffset(user.timezoneGMT);

            api.save();
          });
      })
    );

    res.status(StatusCodes.OK).json(pingAllApisSuccessMsg);
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

const pingOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const { id: apiId } = req.params;

    const api = await ApiCollection.findOne({ _id: apiId });

    if (!api) {
      notFoundError(res, `No API with id: ${apiId}`);
      return;
    }

    checkPermissions(res, user._id, api.createdBy);

    try {
      await axios.get(api.url);

      api.status = ApiStatusOptions.HEALTHY;
      api.lastPinged = getDateWithUTCOffset(user.timezoneGMT);

      await api.save();
    } catch (error) {
      api.status = ApiStatusOptions.UNHEALTHY;
      api.lastPinged = getDateWithUTCOffset(user.timezoneGMT);

      await api.save();
    }

    res.status(StatusCodes.OK).json(pingOneApiSuccessMsg);
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

export { pingAll, pingOne };
