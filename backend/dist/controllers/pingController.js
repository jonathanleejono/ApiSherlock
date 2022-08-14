"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingOne = exports.pingAll = void 0;
const axios_1 = __importDefault(require("axios"));
const messages_1 = require("constants/messages");
const errors_1 = require("errors");
const http_status_codes_1 = require("http-status-codes");
const checkPermissions_1 = __importDefault(require("middleware/checkPermissions"));
const validateUser_1 = __importDefault(require("middleware/validateUser"));
const ApiCollection_1 = __importDefault(require("models/ApiCollection"));
const moment_1 = __importDefault(require("moment"));
const pingAll = async (req, res) => {
    try {
        const user = await (0, validateUser_1.default)(req, res);
        if (!user) {
            (0, errors_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const allApisToMonitor = await ApiCollection_1.default.find({
            createdBy: user._id,
            monitoring: "on",
        });
        if (!allApisToMonitor) {
            (0, errors_1.notFoundError)(res, `No APIs found`);
            return;
        }
        Object.keys(allApisToMonitor).forEach(async (_, index) => {
            const dateTime = (0, moment_1.default)().format("MMM Do YYYY, hh:mm A");
            try {
                const res = await axios_1.default.get(allApisToMonitor[index].url);
                if (res && res.status === 200) {
                    await ApiCollection_1.default.findOneAndUpdate({ _id: allApisToMonitor[index].id }, { status: "healthy", lastPinged: dateTime }, {
                        new: true,
                        runValidators: true,
                    });
                }
            }
            catch (error) {
                await ApiCollection_1.default.findOneAndUpdate({ _id: allApisToMonitor[index].id }, { status: "unhealthy", lastPinged: dateTime }, {
                    new: true,
                    runValidators: true,
                });
            }
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(messages_1.pingAllApisSuccessMsg);
    }
    catch (error) {
        return error;
    }
};
exports.pingAll = pingAll;
const pingOne = async (req, res) => {
    try {
        const user = await (0, validateUser_1.default)(req, res);
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
        const dateTime = (0, moment_1.default)().format("MMM Do YYYY, hh:mm A");
        try {
            const res = await axios_1.default.get(api.url);
            if (res && res.status === 200) {
                await ApiCollection_1.default.findOneAndUpdate({ _id: api.id }, { status: "healthy", lastPinged: dateTime }, {
                    new: true,
                    runValidators: true,
                });
            }
        }
        catch (error) {
            await ApiCollection_1.default.findOneAndUpdate({ _id: api.id }, { status: "unhealthy", lastPinged: dateTime }, {
                new: true,
                runValidators: true,
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(messages_1.pingOneApiSuccessMsg);
    }
    catch (error) {
        return error;
    }
};
exports.pingOne = pingOne;
//# sourceMappingURL=pingController.js.map