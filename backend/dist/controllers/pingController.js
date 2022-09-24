"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingOne = exports.pingAll = void 0;
const axios_1 = __importDefault(require("axios"));
const messages_1 = require("constants/messages");
const apis_1 = require("enum/apis");
const errors_1 = require("errors");
const http_status_codes_1 = require("http-status-codes");
const ApiCollection_1 = __importDefault(require("models/ApiCollection"));
const checkPermissions_1 = __importDefault(require("utils/checkPermissions"));
const datetime_1 = require("utils/datetime");
const getUser_1 = __importDefault(require("utils/getUser"));
const pingAll = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, errors_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    const apis = await ApiCollection_1.default.find({
        createdBy: user._id,
    });
    if (!apis || !(apis.length > 0)) {
        (0, errors_1.notFoundError)(res, `No APIs found`);
        return;
    }
    Object.keys(apis).forEach(async (_, index) => {
        const api = apis[index];
        axios_1.default
            .get(api.url)
            .then(() => {
            api.status = apis_1.ApiStatusOptions.HEALTHY;
            api.lastPinged = (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT);
            api.save();
        })
            .catch(() => {
            api.status = apis_1.ApiStatusOptions.UNHEALTHY;
            api.lastPinged = (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT);
            api.save();
        });
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(messages_1.pingAllApisSuccessMsg);
};
exports.pingAll = pingAll;
const pingOne = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, errors_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    const { id: apiId } = req.params;
    const api = await ApiCollection_1.default.findOne({ _id: apiId });
    if (!api) {
        (0, errors_1.notFoundError)(res, `No API with id: ${apiId}`);
        return;
    }
    (0, checkPermissions_1.default)(res, user._id, api.createdBy);
    try {
        await axios_1.default.get(api.url);
        api.status = apis_1.ApiStatusOptions.HEALTHY;
        api.lastPinged = (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT);
        await api.save();
    }
    catch (error) {
        api.status = apis_1.ApiStatusOptions.UNHEALTHY;
        api.lastPinged = (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT);
        await api.save();
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(messages_1.pingOneApiSuccessMsg);
};
exports.pingOne = pingOne;
//# sourceMappingURL=pingController.js.map