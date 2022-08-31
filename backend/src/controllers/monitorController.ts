import { deleteMonitorSuccessMsg } from "constants/messages";
import {
  validCreateMonitorKeys,
  validMonitorIntervalScheduleOptions,
  validUpdateMonitorKeys,
} from "constants/options/monitor";
import {
  badRequestError,
  notFoundError,
  unAuthenticatedError,
} from "errors/index";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import MonitorCollection from "models/MonitorCollection";
import {
  emptyValuesExist,
  validKeys,
  validValues,
} from "utils/validateKeysValues";
import { validMonitorDate } from "utils/validateMonitorDate";
import validateUserExists from "utils/validateUserExists";

const createMonitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const monitorAlreadyExists = await MonitorCollection.findOne({
      createdBy: user._id,
    });

    if (monitorAlreadyExists) {
      badRequestError(res, "Error, can only have one monitor");
      return;
    }

    if (
      !validKeys(
        res,
        Object.keys(req.body),
        `Invalid monitor creation, can only input: `,
        validCreateMonitorKeys
      )
    )
      return;

    if (emptyValuesExist(res, Object.values(req.body))) return;

    const {
      useInterval,
      useDate,
      intervalSchedule,
      dateDayOfWeek,
      dateHour,
      dateMinute,
    } = req.body;

    if (!useInterval && !useDate) {
      badRequestError(
        res,
        "One of interval and date schedule must be used, please pick one"
      );
      return;
    }

    if (useInterval && useDate) {
      badRequestError(
        res,
        "Interval and date schedule can't both be used, please pick one"
      );
      return;
    }

    if (
      useInterval &&
      !validValues(
        res,
        intervalSchedule,
        `Invalid interval schedule, please select one of: `,
        validMonitorIntervalScheduleOptions
      )
    )
      return;

    if (useDate && !validMonitorDate(res, dateDayOfWeek, dateHour, dateMinute))
      return;

    req.body.createdBy = user._id;

    const monitor = new MonitorCollection(req.body);

    await monitor.validate();

    await MonitorCollection.create(monitor);

    res.status(StatusCodes.CREATED).json(monitor);
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

const getMonitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    //there should be only one monitor per user,
    //so no need to use monitor's id
    const monitor = await MonitorCollection.findOne({ createdBy: user._id });

    if (!monitor) {
      notFoundError(res, `No monitor found`);
      return;
    }

    res.status(StatusCodes.OK).json(monitor);
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

const updateMonitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const monitor = await MonitorCollection.findOne({ createdBy: user._id });

    if (!monitor) {
      notFoundError(res, `No monitor found`);
      return;
    }

    if (
      !validKeys(
        res,
        Object.keys(req.body),
        `Error updating monitor, can only use: `,
        validUpdateMonitorKeys
      )
    )
      return;

    if (emptyValuesExist(res, Object.values(req.body))) return;

    const {
      useInterval,
      useDate,
      intervalSchedule,
      dateDayOfWeek,
      dateHour,
      dateMinute,
    } = req.body;

    if (useInterval && useDate) {
      badRequestError(
        res,
        "Interval and date schedule can't both be used, please pick one"
      );
      return;
    }

    if (!useInterval && !useDate) {
      badRequestError(
        res,
        "One of interval and date schedule must be used, please pick one"
      );
      return;
    }

    if (
      useInterval &&
      !validValues(
        res,
        intervalSchedule,
        `Invalid interval schedule, please select one of: `,
        validMonitorIntervalScheduleOptions
      )
    )
      return;

    if (useDate && !validMonitorDate(res, dateDayOfWeek, dateHour, dateMinute))
      return;

    Object.assign(monitor, req.body);

    await monitor.validate();

    await monitor.save();

    res.status(StatusCodes.OK).json(monitor);
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

const deleteMonitor = async (req: Request, res: Response): Promise<void> => {
  const user = await validateUserExists(req, res);

  if (!user) {
    unAuthenticatedError(res, "Invalid Credentials");
    return;
  }

  const monitor = await MonitorCollection.findOne({
    createdBy: user._id,
  });

  if (!monitor) {
    notFoundError(res, "Error, no monitor found");
    return;
  }

  await monitor.remove();

  res.status(StatusCodes.OK).json(deleteMonitorSuccessMsg);
};

export { createMonitor, deleteMonitor, getMonitor, updateMonitor };
