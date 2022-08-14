import axios from "axios";
import { currentDayYearHour } from "constants/datetime";
import {
  pingAllApisSuccessMsg,
  pingOneApiSuccessMsg,
} from "constants/messages";
import { notFoundError, unAuthenticatedError } from "errors";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "middleware/checkPermissions";
import validateUser from "middleware/validateUser";
import ApiCollection from "models/ApiCollection";

const pingAll = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await validateUser(req, res);

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
            { status: "healthy", lastPinged: currentDayYearHour },
            {
              new: true,
              runValidators: true,
            }
          );
        }
      } catch (error) {
        await ApiCollection.findOneAndUpdate(
          { _id: allApisToMonitor[index].id },
          { status: "unhealthy", lastPinged: currentDayYearHour },
          {
            new: true,
            runValidators: true,
          }
        );
      }
    });

    res.status(StatusCodes.OK).json(pingAllApisSuccessMsg);
  } catch (error) {
    return error;
  }
};

const pingOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUser(req, res);

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
          { status: "healthy", lastPinged: currentDayYearHour },
          {
            new: true,
            runValidators: true,
          }
        );
      }
    } catch (error) {
      await ApiCollection.findOneAndUpdate(
        { _id: api.id },
        { status: "unhealthy", lastPinged: currentDayYearHour },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(StatusCodes.OK).json(pingOneApiSuccessMsg);
  } catch (error) {
    return error;
  }
};

export { pingAll, pingOne };
