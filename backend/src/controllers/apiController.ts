import { deleteApiSuccessMsg } from "constants/messages";
import {
  badRequestError,
  notFoundError,
  unAuthenticatedError,
} from "errors/index";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "middleware/checkPermissions";
import validateUser from "middleware/validateUser";
import ApiCollection from "models/ApiCollection";
import moment from "moment";
import mongoose from "mongoose";
import { validateInputKeys } from "middleware/validateKeys";
import {
  validCreateApiKeys,
  validGetAllApisKeys,
  validUpdateApiKeys,
} from "constants/keys";
import { currentMonthYear } from "constants/datetime";

const createApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUser(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    validateInputKeys(
      req,
      res,
      `Invalid API creation, can only input: `,
      validCreateApiKeys
    );

    const { url, host, monitoring } = req.body;

    if (!url || !host || !monitoring) {
      badRequestError(res, "Please provide all values");
      return;
    }

    req.body.createdBy = user._id;

    const api = await ApiCollection.create(req.body);

    res.status(StatusCodes.CREATED).json(api);
  } catch (error) {
    return error;
  }
};

const getAllApis = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUser(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    validateInputKeys(
      req,
      res,
      `Invalid search params, can only use: `,
      validGetAllApisKeys,
      "query"
    );

    const { status, monitoring, sort, search } = req.query;

    interface QueryParams {
      createdBy: string;
      status?: string;
      monitoring?: string;
      url?: { $regex: string; $options: string };
    }

    const queryObject: QueryParams = {
      createdBy: user._id,
    };

    if (status && status !== "All") {
      queryObject.status = status as string;
    }

    if (monitoring && monitoring !== "All") {
      queryObject.monitoring = monitoring as string;
    }
    if (search) {
      queryObject.url = { $regex: search as string, $options: "i" };
    }

    // no await, the search properties may be altered
    let result = ApiCollection.find(queryObject);

    result = result.sort("-_id");

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

    const allApis = await result;

    const totalApis = await ApiCollection.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalApis / limit);

    res.status(StatusCodes.OK).json({ allApis, totalApis, numOfPages });
  } catch (error) {
    return error;
  }
};

const updateApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUser(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const { id: apiId } = req.params;

    const api = await ApiCollection.findOne({ _id: apiId });

    if (!api) {
      notFoundError(res, `No API with id :${apiId}`);
      return;
    }

    checkPermissions(res, user._id, api.createdBy);

    validateInputKeys(
      req,
      res,
      `Error updating API, can only use: `,
      validUpdateApiKeys
    );

    const updatedApi = await ApiCollection.findOneAndUpdate(
      { _id: apiId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(StatusCodes.OK).json(updatedApi);
  } catch (error) {
    return error;
  }
};

const deleteApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUser(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const { id: apiId } = req.params;

    const api = await ApiCollection.findOne({ _id: apiId });

    if (!api) {
      notFoundError(res, `No API with id :${apiId}`);
      return;
    }

    checkPermissions(res, user._id, api.createdBy);

    await api.remove();

    res.status(StatusCodes.OK).json(deleteApiSuccessMsg);
  } catch (error) {
    return error;
  }
};

const getApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUser(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const { id: apiId } = req.params;

    const api = await ApiCollection.findOne({ _id: apiId });

    if (!api) {
      notFoundError(res, `No API with id :${apiId}`);
      return;
    }

    checkPermissions(res, user._id, api.createdBy);

    res.status(StatusCodes.OK).json(api);
  } catch (error) {
    return error;
  }
};

let monthlyApis = [{ date: currentMonthYear, count: 0 }];

const showStats = async (req: Request, res: Response) => {
  try {
    const user = await validateUser(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const statsStatus = await ApiCollection.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // accumulator, currentValue
    const stats = statsStatus.reduce((acc, curr) => {
      const { _id: title, count } = curr;
      acc[title] = count;
      return acc;
    }, {});

    const defaultStats = {
      healthy: stats.healthy || 0,
      unhealthy: stats.unhealthy || 0,
      pending: stats.pending || 0,
    };

    const aggregate = await ApiCollection.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    if (aggregate.length > 0) {
      monthlyApis = aggregate
        .map((item) => {
          const {
            _id: { year, month },
            count,
          } = item;

          const date = moment()
            .month(month - 1)
            .year(year)
            .format("MMM Y");

          return { date, count };
        })
        .reverse();
    }

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApis });
  } catch (error) {
    return error;
  }
};

export { createApi, deleteApi, getAllApis, updateApi, getApi, showStats };
