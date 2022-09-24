"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedApiCollection = exports.seedUsersCollection = exports.resetMonitorCollection = exports.resetApiCollection = exports.resetUsersCollection = void 0;
const envVars_1 = require("constants/envVars");
const index_1 = require("errors/index");
const mockApis_1 = require("mocks/mockApis");
const mockUser_1 = require("mocks/mockUser");
const ApiCollection_1 = __importDefault(require("models/ApiCollection"));
const MonitorCollection_1 = __importDefault(require("models/MonitorCollection"));
const UserCollection_1 = __importDefault(require("models/UserCollection"));
const getUser_1 = __importDefault(require("utils/getUser"));
const resetUsersCollection = async (_, res) => {
    try {
        if (!envVars_1.TEST_ENV) {
            (0, index_1.badRequestError)(res, "Can only seed db in testing");
            return;
        }
        else {
            await UserCollection_1.default.collection.drop();
            res.status(200).json({ msg: "DB reset!" });
        }
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.resetUsersCollection = resetUsersCollection;
const resetApiCollection = async (_, res) => {
    try {
        if (!envVars_1.TEST_ENV) {
            (0, index_1.badRequestError)(res, "Can only seed db in testing");
            return;
        }
        else {
            await ApiCollection_1.default.collection.drop();
            res.status(200).json({ msg: "DB reset!" });
        }
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.resetApiCollection = resetApiCollection;
const resetMonitorCollection = async (_, res) => {
    try {
        if (!envVars_1.TEST_ENV) {
            (0, index_1.badRequestError)(res, "Can only seed db in testing");
            return;
        }
        else {
            await MonitorCollection_1.default.collection.drop();
            res.status(200).json({ msg: "DB reset!" });
        }
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.resetMonitorCollection = resetMonitorCollection;
const seedUsersCollection = async (_, res) => {
    try {
        if (!envVars_1.TEST_ENV) {
            (0, index_1.badRequestError)(res, "Can only seed db in testing");
            return;
        }
        else {
            const user = new UserCollection_1.default(mockUser_1.mockUser);
            await user.validate();
            await UserCollection_1.default.create(user);
            res.status(201).json({ msg: "DB seeded!" });
        }
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.seedUsersCollection = seedUsersCollection;
const seedApiCollection = async (req, res) => {
    if (!envVars_1.TEST_ENV) {
        (0, index_1.badRequestError)(res, "Can only seed db in testing");
        return;
    }
    else {
        try {
            const user = await (0, getUser_1.default)(req, res);
            if (!user) {
                (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
                return;
            }
            const testApis = mockApis_1.mockApis.map((api) => (Object.assign(Object.assign({}, api), { createdBy: user._id })));
            await ApiCollection_1.default.insertMany(testApis);
            res.status(200).json({ msg: "DB seeded!" });
        }
        catch (error) {
            console.log(error);
            (0, index_1.badRequestError)(res, error);
            return;
        }
    }
};
exports.seedApiCollection = seedApiCollection;
//# sourceMappingURL=seedDB.js.map