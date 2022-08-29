import {
  validCreateApiKeys,
  validApiSearchParams,
  validUpdateApiKeys,
  validApiHostOptions,
  validApiMonitoringOptions,
  validApiStatusOptions,
} from "constants/options/apis";
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
import {
  emptyValuesExist,
  validKeys,
  validValues,
} from "utils/validateKeysValues";
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

    if (emptyValuesExist(res, Object.values(req.body))) return;

    const { host, monitoring } = req.body;

    if (
      !validValues(
        res,
        host,
        `Invalid host, please select one of: `,
        validApiHostOptions
      )
    )
      return;

    if (
      !validValues(
        res,
        monitoring,
        `Invalid monitoring, please select one of: `,
        validApiMonitoringOptions
      )
    )
      return;

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
        validApiSearchParams
      )
    )
      return;

    const { host, status, monitoring, sort, search, page, limit } = req.query;

    const queryObject: ApiQueryParams = {
      createdBy: user._id,
    };

    if (
      host &&
      !validValues(
        res,
        host as string,
        `Invalid host search, please select one of: `,
        [...validApiHostOptions, "All"]
      )
    )
      return;
    else if (host && host !== "All") {
      queryObject.host = host as string;
    }

    if (
      status &&
      !validValues(
        res,
        status as string,
        `Invalid status search, please select one of: `,
        [...validApiStatusOptions, "All"]
      )
    )
      return;
    else if (status && status !== "All") {
      queryObject.status = status as string;
    }

    if (
      monitoring &&
      !validValues(
        res,
        monitoring as string,
        `Invalid monitoring search, please select one of: `,
        [...validApiMonitoringOptions, "All"]
      )
    )
      return;
    else if (monitoring && monitoring !== "All") {
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
    const _page = Number(page) || 1;
    const _limit = Number(limit) || 10;
    const skip = (_page - 1) * _limit;

    result = result.skip(skip).limit(_limit);

    const allApis = await result;

    // you could use await ApiCollection.countDocuments(queryObject),
    // if you wanted a specific filter for the count
    const totalApis = allApis.length;
    const numOfPages = Math.ceil(totalApis / _limit);

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

    if (
      !validKeys(
        res,
        Object.keys(req.body),
        `Error updating API, can only use: `,
        validUpdateApiKeys
      )
    )
      return;

    if (emptyValuesExist(res, Object.values(req.body))) return;

    const { host, monitoring } = req.body;

    if (
      host &&
      !validValues(
        res,
        host,
        `Invalid host, please select one of: `,
        validApiHostOptions
      )
    )
      return;

    if (
      monitoring &&
      !validValues(
        res,
        monitoring,
        `Invalid monitoring, please select one of: `,
        validApiMonitoringOptions
      )
    )
      return;

    const api = await ApiCollection.findOne({ _id: apiId });

    if (!api) {
      notFoundError(res, `No API with id: ${apiId}`);
      return;
    }

    checkPermissions(res, user._id, api.createdBy);

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
      notFoundError(res, `No API with id: ${apiId}`);
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
      notFoundError(res, `No API with id: ${apiId}`);
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
