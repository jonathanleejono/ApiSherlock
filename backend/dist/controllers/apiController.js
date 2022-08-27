"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showStats = exports.getApi = exports.updateApi = exports.getAllApis = exports.deleteApi = exports.createApi = void 0;
const datetime_1 = require("utils/datetime");
const keys_1 = require("constants/keys");
const messages_1 = require("constants/messages");
const index_1 = require("errors/index");
const http_status_codes_1 = require("http-status-codes");
const checkPermissions_1 = __importDefault(require("utils/checkPermissions"));
const validateKeys_1 = require("utils/validateKeys");
const validateUserExists_1 = __importDefault(require("utils/validateUserExists"));
const ApiCollection_1 = __importDefault(require("models/ApiCollection"));
const mongoose_1 = __importDefault(require("mongoose"));
const apis_1 = require("enum/apis");
const createApi = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        (0, validateKeys_1.validateInputKeys)(req, res, `Invalid API creation, can only input: `, keys_1.validCreateApiKeys);
        const { url, host, monitoring } = req.body;
        if (!url || !host || !monitoring) {
            (0, index_1.badRequestError)(res, "Please provide all values");
            return;
        }
        req.body.createdBy = user._id;
        const api = await ApiCollection_1.default.create(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json(api);
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.createApi = createApi;
const getAllApis = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        (0, validateKeys_1.validateInputKeys)(req, res, `Invalid search params, can only use: `, keys_1.validGetAllApisKeys, "query");
        const { status, monitoring, sort, search } = req.query;
        const queryObject = {
            createdBy: user._id,
        };
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
        result = result.sort("-_id");
        if (sort === apis_1.ApiSortOptions.Latest) {
            result = result.sort("-createdAt");
        }
        if (sort === apis_1.ApiSortOptions.Oldest) {
            result = result.sort("createdAt");
        }
        if (sort === apis_1.ApiSortOptions.A_Z) {
            result = result.sort("url");
        }
        if (sort === apis_1.ApiSortOptions.Z_A) {
            result = result.sort("-url");
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        result = result.skip(skip).limit(limit);
        const allApis = await result;
        const totalApis = await ApiCollection_1.default.countDocuments(queryObject);
        const numOfPages = Math.ceil(totalApis / limit);
        res.status(http_status_codes_1.StatusCodes.OK).json({ allApis, totalApis, numOfPages });
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.getAllApis = getAllApis;
const updateApi = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const { id: apiId } = req.params;
        const api = await ApiCollection_1.default.findOne({ _id: apiId });
        if (!api) {
            (0, index_1.notFoundError)(res, `No API with id :${apiId}`);
            return;
        }
        (0, checkPermissions_1.default)(res, user._id, api.createdBy);
        (0, validateKeys_1.validateInputKeys)(req, res, `Error updating API, can only use: `, keys_1.validUpdateApiKeys);
        const updatedApi = await ApiCollection_1.default.findOneAndUpdate({ _id: apiId }, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(updatedApi);
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.updateApi = updateApi;
const deleteApi = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const { id: apiId } = req.params;
        const api = await ApiCollection_1.default.findOne({ _id: apiId });
        if (!api) {
            (0, index_1.notFoundError)(res, `No API with id :${apiId}`);
            return;
        }
        (0, checkPermissions_1.default)(res, user._id, api.createdBy);
        await api.remove();
        res.status(http_status_codes_1.StatusCodes.OK).json(messages_1.deleteApiSuccessMsg);
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.deleteApi = deleteApi;
const getApi = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const { id: apiId } = req.params;
        const api = await ApiCollection_1.default.findOne({ _id: apiId });
        if (!api) {
            (0, index_1.notFoundError)(res, `No API with id :${apiId}`);
            return;
        }
        (0, checkPermissions_1.default)(res, user._id, api.createdBy);
        res.status(http_status_codes_1.StatusCodes.OK).json(api);
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.getApi = getApi;
let monthlyApis = [{ date: "", count: 0 }];
const showStats = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user || !user._id) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const userId = new mongoose_1.default.Types.ObjectId(user._id);
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
                const date = (0, datetime_1.formatCurrentMonthYear)(year, month);
                return { date, count };
            })
                .reverse();
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ defaultStats, monthlyApis });
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.showStats = showStats;
//# sourceMappingURL=apiController.js.map