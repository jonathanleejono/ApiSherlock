import {
  validCreateApiKeys,
  validGetAllApisKeys,
  validUpdateApiKeys,
} from "constants/keys";
import { deleteApiSuccessMsg } from "constants/messages";
import { ApiSortOptions } from "enum/apis";
import {
  badRequestError,
  notFoundError,
  unAuthenticatedError,
} from "errors/index";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiQueryParams } from "interfaces/apiQueryParams";
import { ApiDefaultStats, MonthlyApis } from "interfaces/apiStats";
import ApiCollection from "models/ApiCollection";
import checkPermissions from "utils/checkPermissions";
import { formatCurrentMonthYear } from "utils/datetime";
import { validKeys } from "utils/validateKeys";
import validateUserExists from "utils/validateUserExists";

const createApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    if (
      !validKeys(
        res,
        Object.keys(req.body),
        `Invalid API creation, can only input: `,
        validCreateApiKeys
      )
    )
      return;

    const { url, host, monitoring } = req.body;

    if (!url || !host || !monitoring) {
      badRequestError(res, "Please provide all values");
      return;
    }

    req.body.createdBy = user._id;

    const api = await ApiCollection.create(req.body);

    res.status(StatusCodes.CREATED).json(api);
  } catch (error) {
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

const getAllApis = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    if (
      !validKeys(
        res,
        Object.keys(req.query),
        `Invalid search params, can only use: `,
        validGetAllApisKeys
      )
    )
      return;

    const { status, monitoring, sort, search } = req.query;

    const queryObject: ApiQueryParams = {
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

    if (sort === ApiSortOptions.Latest) {
      result = result.sort("-createdAt");
    }
    if (sort === ApiSortOptions.Oldest) {
      result = result.sort("createdAt");
    }
    if (sort === ApiSortOptions.A_Z) {
      result = result.sort("url");
    }
    if (sort === ApiSortOptions.Z_A) {
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
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

const updateApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const { id: apiId } = req.params;

    if (!apiId) {
      badRequestError(res, "Please provide API id");
      return;
    }

    const api = await ApiCollection.findOne({ _id: apiId });

    if (!api) {
      notFoundError(res, `No API with id :${apiId}`);
      return;
    }

    checkPermissions(res, user._id, api.createdBy);

    if (
      !validKeys(
        res,
        Object.keys(req.body),
        `Error updating API, can only use: `,
        validUpdateApiKeys
      )
    )
      return;

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
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

const deleteApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const { id: apiId } = req.params;

    if (!apiId) {
      badRequestError(res, "Please provide API id");
      return;
    }

    const api = await ApiCollection.findOne({ _id: apiId });

    if (!api) {
      notFoundError(res, `No API with id :${apiId}`);
      return;
    }

    checkPermissions(res, user._id, api.createdBy);

    await api.remove();

    res.status(StatusCodes.OK).json(deleteApiSuccessMsg);
  } catch (error) {
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

const getApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const { id: apiId } = req.params;

    if (!apiId) {
      badRequestError(res, "Please provide API id");
      return;
    }

    const api = await ApiCollection.findOne({ _id: apiId });

    if (!api) {
      notFoundError(res, `No API with id :${apiId}`);
      return;
    }

    checkPermissions(res, user._id, api.createdBy);

    res.status(StatusCodes.OK).json(api);
  } catch (error) {
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

let monthlyApis: MonthlyApis[] = [{ date: "", count: 0 }];

const showStats = async (req: Request, res: Response) => {
  try {
    const user = await validateUserExists(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const userId = user._id;

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

    const defaultStats: ApiDefaultStats = {
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

          const date = formatCurrentMonthYear(year, month);

          return { date, count };
        })
        .reverse();
    }

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApis });
  } catch (error) {
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

export { createApi, deleteApi, getAllApis, updateApi, getApi, showStats };
