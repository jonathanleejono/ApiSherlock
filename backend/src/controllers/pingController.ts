import axios from "axios";
import { getDateWithUTCOffset } from "utils/datetime";
import {
  pingAllApisSuccessMsg,
  pingOneApiSuccessMsg,
} from "constants/messages";
import { badRequestError, notFoundError, unAuthenticatedError } from "errors";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "utils/checkPermissions";
import validateUserExists from "utils/validateUserExists";
import ApiCollection from "models/ApiCollection";

const pingAll = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const allApisToMonitor = await ApiCollection.find({
      createdBy: user._id,
      monitoring: "on",
    });

    if (!allApisToMonitor) {
      notFoundError(res, `No APIs found`);
      return;
    }

    Object.keys(allApisToMonitor).forEach(async (_, index: number) => {
      try {
        const res = await axios.get(allApisToMonitor[index].url);
        if (res && res.status === 200) {
          await ApiCollection.findOneAndUpdate(
            { _id: allApisToMonitor[index].id },
            {
              status: "healthy",
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
          { _id: allApisToMonitor[index].id },
          {
            status: "unhealthy",
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
    console.log(error);
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
            status: "healthy",
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
          status: "unhealthy",
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
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

export { pingAll, pingOne };
