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
const validateUserExists_1 = __importDefault(require("utils/validateUserExists"));
const pingAll = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
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
            try {
                const res = await axios_1.default.get(apis[index].url);
                if (res && res.status === 200) {
                    await ApiCollection_1.default.findOneAndUpdate({ _id: apis[index].id }, {
                        status: apis_1.ApiStatusOptions.Healthy,
                        lastPinged: (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT),
                    }, {
                        new: true,
                        runValidators: true,
                    });
                }
            }
            catch (error) {
                await ApiCollection_1.default.findOneAndUpdate({ _id: apis[index].id }, {
                    status: apis_1.ApiStatusOptions.Unhealthy,
                    lastPinged: (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT),
                }, {
                    new: true,
                    runValidators: true,
                });
            }
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(messages_1.pingAllApisSuccessMsg);
    }
    catch (error) {
        (0, errors_1.badRequestError)(res, error);
        return;
    }
};
exports.pingAll = pingAll;
const pingOne = async (req, res) => {
    try {
        const user = await (0, validateUserExists_1.default)(req, res);
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
            const res = await axios_1.default.get(api.url);
            if (res && res.status === 200) {
                await ApiCollection_1.default.findOneAndUpdate({ _id: api.id }, {
                    status: apis_1.ApiStatusOptions.Healthy,
                    lastPinged: (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT),
                }, {
                    new: true,
                    runValidators: true,
                });
            }
        }
        catch (error) {
            await ApiCollection_1.default.findOneAndUpdate({ _id: api.id }, {
                status: apis_1.ApiStatusOptions.Unhealthy,
                lastPinged: (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT),
            }, {
                new: true,
                runValidators: true,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(messages_1.pingOneApiSuccessMsg);
    }
    catch (error) {
        (0, errors_1.badRequestError)(res, error);
        return;
    }
};
exports.pingOne = pingOne;
//# sourceMappingURL=pingController.js.map