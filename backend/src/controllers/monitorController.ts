import { deleteMonitorSuccessMsg } from "constants/messages";
import {
  validCreateMonitorKeys,
  validMonitorDateDayOfWeekOptions,
  validMonitorDateHourOptions,
  validMonitorDateMinuteOptions,
  validUpdateMonitorKeys,
} from "constants/options/monitor";
import {
  MonitorDateAMOrPMOptions,
  MonitorIntervalScheduleOptions,
  MonitorScheduleTypeOptions,
  MonitorSettingOptions,
} from "enum/monitor";
import {
  badRequestError,
  notFoundError,
  unAuthenticatedError,
} from "errors/index";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import MonitorCollection from "models/MonitorCollection";
import { Monitor } from "models/MonitorDocument";
import getUser from "utils/getUser";
import { validKeys } from "utils/validateKeysValues";

const createMonitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await getUser(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const monitorAlreadyExists = await MonitorCollection.findOne({
      createdBy: user._id,
    });

    if (monitorAlreadyExists) {
      badRequestError(
        res,
        "Error, can only have one monitor, please turn off to remove"
      );
      return;
    }

    if (
      !validKeys(
        res,
        Object.keys(req.body),
        `Invalid monitor input, can only input: `,
        validCreateMonitorKeys
      )
    )
      return;

    const { monitorSetting } = req.body;

    if (monitorSetting !== MonitorSettingOptions.ON) {
      badRequestError(res, "Monitor setting must be on to add monitor");
      return;
    }

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
    const user = await getUser(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    //there should be only one monitor per user,
    //so no need to use monitor's id
    const monitor = await MonitorCollection.findOne({ createdBy: user._id });

    if (!monitor) {
      const _monitor: Omit<Monitor, "_id" | "createdBy"> = {
        monitorSetting: MonitorSettingOptions.OFF,
        scheduleType: MonitorScheduleTypeOptions.INTERVAL,
        intervalSchedule: MonitorIntervalScheduleOptions.WEEKLY,
        dateDayOfWeek: validMonitorDateDayOfWeekOptions[0],
        dateHour: validMonitorDateHourOptions[0],
        dateMinute: validMonitorDateMinuteOptions[0],
        dateAMOrPM: MonitorDateAMOrPMOptions.AM,
      };

      res.status(StatusCodes.OK).json(_monitor);
    } else {
      res.status(StatusCodes.OK).json(monitor);
    }
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

const updateMonitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await getUser(req, res);

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
  const user = await getUser(req, res);

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

  if (monitor.monitorSetting === MonitorSettingOptions.ON) {
    badRequestError(res, "Monitor setting must be off to remove monitor");
    return;
  }

  await monitor.remove();

  res.status(StatusCodes.OK).json(deleteMonitorSuccessMsg);
};

export { createMonitor, deleteMonitor, getMonitor, updateMonitor };
