import { deleteApiSuccessMsg } from "constants/messages";
import {
  validApiSearchParams,
  validCreateApiKeys,
  validUpdateApiKeys,
} from "constants/options/apis";
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
import { SortOrder } from "mongoose";
import checkPermissions from "utils/checkPermissions";
import { formatCurrentMonthYear } from "utils/datetime";
import getUser from "utils/getUser";
import { validKeys } from "utils/validateKeysValues";

const createApi = async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req, res);

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

  req.body.createdBy = user._id;

  const api = new ApiCollection(req.body);

  await api.validate();

  await ApiCollection.create(api);

  res.status(StatusCodes.CREATED).json(api);
};

const getAllApis = async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req, res);

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

  if (host && host !== "All") {
    queryObject.host = host as string;
  }

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

  let sortOptions:
    | string
    | { [key: string]: SortOrder | { $meta: "textScore" } } = { url: -1 };

  if (sort === ApiSortOptions.LATEST) {
    sortOptions = {
      createdAt: -1,
    };
  }
  if (sort === ApiSortOptions.OLDEST) {
    sortOptions = {
      createdAt: 1,
    };
  }
  if (sort === ApiSortOptions.A_Z) {
    sortOptions = {
      url: 1,
    };
  }
  if (sort === ApiSortOptions.Z_A) {
    sortOptions = {
      url: -1,
    };
  }

  result = result.sort(sortOptions);

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
};

const updateApi = async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req, res);

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

  const api = await ApiCollection.findOne({ _id: apiId });

  if (!api) {
    notFoundError(res, `No API with id: ${apiId}`);
    return;
  }

  checkPermissions(res, user._id, api.createdBy);

  Object.assign(api, req.body);

  await api.validate();

  await api.save();

  res.status(StatusCodes.OK).json(api);
};

const deleteApi = async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req, res);

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
};

const getApi = async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req, res);

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
};

let monthlyApis: MonthlyApis[] = [{ date: "", count: 0 }];

const showStats = async (req: Request, res: Response) => {
  const user = await getUser(req, res);

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

        let date = formatCurrentMonthYear(year, month);

        if (process.env.NODE_ENV === "production") {
          date = formatCurrentMonthYear(year, month - 1);
        }

        return { date, count };
      })
      .reverse();
  }

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApis });
};

export { createApi, deleteApi, getAllApis, updateApi, getApi, showStats };
