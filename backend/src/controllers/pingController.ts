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

//eslint-disable-next-line
const pingAll = async (req: Request, res: Response): Promise<any> => {
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

    //the try catch is to ignore not found url error
    Object.keys(apis).forEach(async (_, index: number) => {
      try {
        const res = await axios.get(apis[index].url);
        if (res && res.status === 200) {
          await ApiCollection.findOneAndUpdate(
            { _id: apis[index].id },
            {
              status: ApiStatusOptions.HEALTHY,
              lastPinged: getDateWithUTCOffset(user.timezoneGMT),
            },
            {
              new: true,
              runValidators: true,
            }
          );
        }
      } catch (error) {
        await ApiCollection.findOneAndUpdate(
          { _id: apis[index].id },
          {
            status: ApiStatusOptions.UNHEALTHY,
            lastPinged: getDateWithUTCOffset(user.timezoneGMT),
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
    });

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
      const res = await axios.get(api.url);
      if (res && res.status === 200) {
        await ApiCollection.findOneAndUpdate(
          { _id: api.id },
          {
            status: ApiStatusOptions.HEALTHY,
            lastPinged: getDateWithUTCOffset(user.timezoneGMT),
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
    } catch (error) {
      await ApiCollection.findOneAndUpdate(
        { _id: api.id },
        {
          status: ApiStatusOptions.UNHEALTHY,
          lastPinged: getDateWithUTCOffset(user.timezoneGMT),
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(StatusCodes.OK).json(pingOneApiSuccessMsg);
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

export { pingAll, pingOne };
