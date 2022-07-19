import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index";
import Monitor from "../models/MonitorCollection";
import Api from "../models/ApiCollection";
import checkPermissions from "../utils/checkPermissions";
import axios from "axios";

const createMonitor = async (req: Request, res: Response): Promise<void> => {
  const { intervalSetting, intervalSchedule, time, dayOfWeek } = req.body;

  if (!intervalSetting || !intervalSchedule || !time || !dayOfWeek) {
    throw new BadRequestError("Please provide all values");
  }

  // add exception handling -> only one monitor can be created

  req.body.createdBy = req?.user?.userId;

  const monitor = await Monitor.create(req.body);

  res.status(StatusCodes.CREATED).json({ monitor });
};

// -------------------------------------------

const updateMonitor = async (req: Request, res: Response): Promise<void> => {
  const { id: monitorId } = req.params;

  const { intervalSetting, intervalSchedule, time, dayOfWeek } = req.body;

  if (!intervalSetting || !intervalSchedule || !time || !dayOfWeek) {
    throw new BadRequestError("Please provide all values");
  }
  const monitor = await Monitor.findOne({ _id: monitorId });

  if (!monitor) {
    throw new NotFoundError(`No monitor with id :${monitorId}`);
  }

  // check authorization
  checkPermissions(req.user, monitor.createdBy);

  const updatedMonitor = await Monitor.findOneAndUpdate(
    { _id: monitorId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ updatedMonitor });
};

// ----------------------------------

// if monitoring goes from ON to OFF, make api call to delete monitor
const deleteMonitor = async (req: Request, res: Response): Promise<void> => {
  const { id: monitorId } = req.params;

  const monitor = await Monitor.findOne({ _id: monitorId });

  if (!monitor) {
    throw new NotFoundError(`No monitor with id :${monitorId}`);
  }

  checkPermissions(req.user, monitor.createdBy);

  await monitor.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Monitor removed" });
};

// ----------------------------------

const activateMonitor = async (req: Request, res: Response): Promise<void> => {
  let monitor = await Monitor.findOne({
    createdBy: req?.user?.userId,
  });

  const apiCall = async () => {
    const queryObject = {
      createdBy: req?.user?.userId,
      monitoring: "on",
    };

    const allApisToMonitor = await Api.find(queryObject);

    Object.keys(allApisToMonitor).forEach(async (api) => {
      try {
        const res = await axios.get(allApisToMonitor[api].url);
        if (res) {
          Monitor.updateOne;
          // update api status
          // update api last pinged
        }
      } catch (error) {
        // update api status to unhealthy
        // update api last pinged
      }
    });
  };

  if (monitor?.setting && monitor?.intervalSetting) {
    const intervalSchedule = monitor?.intervalSchedule;
    let time: number | undefined;

    switch (intervalSchedule) {
      case "weekly":
        time = 604800000;
        break;
      case "daily":
        time = 86400000;
        break;
      case "hourly":
        time = 3600000;
        break;
      case "seconds":
        time = 1000;
        break;
      default:
        time = undefined;
    }

    let interval = setInterval(async () => {
      apiCall();
      monitor = await Monitor.findOne({
        createdBy: req?.user?.userId,
      });
    }, time);

    if (!monitor?.setting) {
      clearInterval(interval);
    }
  } else if (monitor?.intervalSetting === false) {
  }

  res.json({ hello: "there" });
};

export { createMonitor, deleteMonitor, updateMonitor, activateMonitor };
