"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showStats = exports.getApi = exports.updateApi = exports.getAllApis = exports.deleteApi = exports.createApi = void 0;
const messages_1 = require("constants/messages");
const apis_1 = require("constants/options/apis");
const apis_2 = require("enum/apis");
const index_1 = require("errors/index");
const http_status_codes_1 = require("http-status-codes");
const ApiCollection_1 = __importDefault(require("models/ApiCollection"));
const checkPermissions_1 = __importDefault(require("utils/checkPermissions"));
const datetime_1 = require("utils/datetime");
const getUser_1 = __importDefault(require("utils/getUser"));
const validateKeysValues_1 = require("utils/validateKeysValues");
const createApi = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Invalid API creation, can only input: `, apis_1.validCreateApiKeys))
        return;
    req.body.createdBy = user._id;
    const api = new ApiCollection_1.default(req.body);
    await api.validate();
    await ApiCollection_1.default.create(api);
    res.status(http_status_codes_1.StatusCodes.CREATED).json(api);
};
exports.createApi = createApi;
const getAllApis = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.query), `Invalid search params, can only use: `, apis_1.validApiSearchParams))
        return;
    const { host, status, monitoring, sort, search, page, limit } = req.query;
    const queryObject = {
        createdBy: user._id,
    };
    if (host && host !== "All") {
        queryObject.host = host;
    }
    if (status && status !== "All") {
        queryObject.status = status;
    }
    if (monitoring && monitoring !== "All") {
        queryObject.monitoring = monitoring;
    }
    if (search) {
        queryObject.url = { $regex: search, $options: "i" };
    }
    let result = ApiCollection_1.default.find(queryObject);
    let sortOptions = { url: -1 };
    if (sort === apis_2.ApiSortOptions.LATEST) {
        sortOptions = {
            createdAt: -1,
        };
    }
    if (sort === apis_2.ApiSortOptions.OLDEST) {
        sortOptions = {
            createdAt: 1,
        };
    }
    if (sort === apis_2.ApiSortOptions.A_Z) {
        sortOptions = {
            url: 1,
        };
    }
    if (sort === apis_2.ApiSortOptions.Z_A) {
        sortOptions = {
            url: -1,
        };
    }
    result = result.sort(sortOptions);
    const _page = Number(page) || 1;
    const _limit = Number(limit) || 10;
    const skip = (_page - 1) * _limit;
    result = result.skip(skip).limit(_limit);
    const allApis = await result;
    const totalApis = allApis.length;
    const numOfPages = Math.ceil(totalApis / _limit);
    res.status(http_status_codes_1.StatusCodes.OK).json({ allApis, totalApis, numOfPages });
};
exports.getAllApis = getAllApis;
const updateApi = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    const { id: apiId } = req.params;
    if (!apiId) {
        (0, index_1.badRequestError)(res, "Please provide API id");
        return;
    }
    if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Error updating API, can only use: `, apis_1.validUpdateApiKeys))
        return;
    const api = await ApiCollection_1.default.findOne({ _id: apiId });
    if (!api) {
        (0, index_1.notFoundError)(res, `No API with id: ${apiId}`);
        return;
    }
    (0, checkPermissions_1.default)(res, user._id, api.createdBy);
    Object.assign(api, req.body);
    await api.validate();
    await api.save();
    res.status(http_status_codes_1.StatusCodes.OK).json(api);
};
exports.updateApi = updateApi;
const deleteApi = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    const { id: apiId } = req.params;
    if (!apiId) {
        (0, index_1.badRequestError)(res, "Please provide API id");
        return;
    }
    const api = await ApiCollection_1.default.findOne({ _id: apiId });
    if (!api) {
        (0, index_1.notFoundError)(res, `No API with id: ${apiId}`);
        return;
    }
    (0, checkPermissions_1.default)(res, user._id, api.createdBy);
    await api.remove();
    res.status(http_status_codes_1.StatusCodes.OK).json(messages_1.deleteApiSuccessMsg);
};
exports.deleteApi = deleteApi;
const getApi = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    const { id: apiId } = req.params;
    if (!apiId) {
        (0, index_1.badRequestError)(res, "Please provide API id");
        return;
    }
    const api = await ApiCollection_1.default.findOne({ _id: apiId });
    if (!api) {
        (0, index_1.notFoundError)(res, `No API with id: ${apiId}`);
        return;
    }
    (0, checkPermissions_1.default)(res, user._id, api.createdBy);
    res.status(http_status_codes_1.StatusCodes.OK).json(api);
};
exports.getApi = getApi;
let monthlyApis = [{ date: "", count: 0 }];
const showStats = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    const userId = user._id;
    const statsStatus = await ApiCollection_1.default.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
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
    const aggregate = await ApiCollection_1.default.aggregate([
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
            const { _id: { year, month }, count, } = item;
            let date = (0, datetime_1.formatCurrentMonthYear)(year, month);
            if (process.env.NODE_ENV === "production") {
                date = (0, datetime_1.formatCurrentMonthYear)(year, month - 1);
            }
            return { date, count };
        })
            .reverse();
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ defaultStats, monthlyApis });
};
exports.showStats = showStats;
//# sourceMappingURL=apiController.js.map