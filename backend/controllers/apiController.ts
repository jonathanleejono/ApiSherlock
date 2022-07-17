import Api from "../models/ApiCollection";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index";
import checkPermissions from "../utils/checkPermissions";
import mongoose from "mongoose";
import moment from "moment";

const createApi = async (req: Request, res: Response): Promise<void> => {
  const { url, host, monitoring } = req.body;

  if (!url || !host || !monitoring) {
    throw new BadRequestError("Please provide all values");
  }

  req.body.createdBy = req?.user?.userId;

  const api = await Api.create(req.body);

  res.status(StatusCodes.CREATED).json({ api });
};

// -------------------------------------------

export interface AllApisResponse {
  tickets: any[];
  totalTickets: number;
  numOfPages: number;
}

const getAllApis = async (
  req: Request,
  res: Response
): Promise<AllApisResponse> => {
  const { url, status, lastPinged, monitoring, sort, search } = req.query;

  const queryObject = {
    createdBy: req?.user?.userId,
    url: url,
    status: status,
    lastPinged: lastPinged,
    monitoring: monitoring,
  };

  // can add more stuff based on condition

  if (status && status !== "All") {
    queryObject.status = status;
  }
  if (lastPinged && lastPinged !== "All") {
    queryObject.lastPinged = lastPinged;
  }
  if (monitoring && monitoring !== "All") {
    queryObject.monitoring = monitoring;
  }
  if (search) {
    queryObject.url = { $regex: search, $options: "i" };
  }

  // NO AWAIT

  let result = Api.find(queryObject);

  // chain sort conditions

  if (sort === "Latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "Oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "A-Z") {
    result = result.sort("url");
  }
  if (sort === "Z-A") {
    result = result.sort("-url");
  }

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const tickets = await result;

  const totalTickets = await Api.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalTickets / limit);

  res.status(StatusCodes.OK);

  return { tickets, totalTickets, numOfPages };
};

// ------------------------------------------

const updateApi = async (req: Request, res: Response): Promise<void> => {
  const { id: apiId } = req.params;

  const { host, url, monitoring } = req.body;

  if (!url || !host || !monitoring) {
    throw new BadRequestError("Please provide all values");
  }
  const api = await Api.findOne({ _id: apiId });

  if (!api) {
    throw new NotFoundError(`No API with id :${apiId}`);
  }

  // check authorization
  checkPermissions(req.user, api.createdBy);

  const updatedApi = await Api.findOneAndUpdate({ _id: apiId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json(updatedApi);
};

// ----------------------------------

const deleteApi = async (req: Request, res: Response): Promise<void> => {
  const { id: apiId } = req.params;

  const api = await Api.findOne({ _id: apiId });

  if (!api) {
    throw new NotFoundError(`No api with id :${apiId}`);
  }

  checkPermissions(req.user, api.createdBy);

  await api.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Api removed" });
};

// ----------------------------------

// const showStats = async (req: Request, res: Response) => {
//   let statsStatus = await Api.aggregate([
//     { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
//     { $group: { _id: "$status", count: { $sum: 1 } } },
//   ]);

//   let statsType = await Api.aggregate([
//     { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
//     { $group: { _id: "$ApiType", count: { $sum: 1 } } },
//   ]);

//   let statsPriority = await Api.aggregate([
//     { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
//     { $group: { _id: "$ticketPriority", count: { $sum: 1 } } },
//   ]);

//   // accumulator, currentValue
//   statsStatus = statsStatus.reduce((acc, curr) => {
//     const { _id: title, count } = curr;
//     acc[title] = count;
//     return acc;
//   }, {});

//   statsType = statsType.reduce((acc, curr) => {
//     const { _id: title, count } = curr;
//     acc[title] = count;
//     return acc;
//   }, {});

//   statsPriority = statsPriority.reduce((acc, curr) => {
//     const { _id: title, count } = curr;
//     acc[title] = count;
//     return acc;
//   }, {});

//   const defaultStats = {
//     Open: statsStatus.Open || 0,
//     High: statsPriority.High || 0,
//     Bug: statsType.Bug || 0,
//   };

//   let monthlyApplications = await Ticket.aggregate([
//     { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
//     {
//       $group: {
//         _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { "_id.year": -1, "_id.month": -1 } },
//     { $limit: 6 },
//   ]);

//   monthlyApplications = monthlyApplications
//     .map((item) => {
//       const {
//         _id: { year, month },
//         count,
//       } = item;

//       const date = moment()
//         .month(month - 1)
//         .year(year)
//         .format("MMM Y");
//       return { date, count };
//     })
//     .reverse();

//   res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
// };

export {
  createApi,
  deleteApi,
  getAllApis,
  updateApi,
  // showStats
};
