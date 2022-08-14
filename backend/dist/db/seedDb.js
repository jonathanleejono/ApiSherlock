"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedApiCollection = exports.seedUsersCollection = exports.resetApiCollection = exports.resetUsersCollection = void 0;
const ApiCollection_1 = __importDefault(require("models/ApiCollection"));
const UserCollection_1 = __importDefault(require("models/UserCollection"));
const dotenv_1 = __importDefault(require("dotenv"));
const mockApis_1 = require("mocks/mockApis");
const mockUser_1 = require("mocks/mockUser");
const index_1 = require("errors/index");
const validateUser_1 = __importDefault(require("middleware/validateUser"));
dotenv_1.default.config();
const resetUsersCollection = async (_, res) => {
    if (process.env.NODE_ENV !== "testing") {
        (0, index_1.badRequestError)(res, "Can only seed db in testing");
        return;
    }
    else {
        await UserCollection_1.default.collection.drop();
        res.status(200).json({ msg: "DB reset!" });
    }
};
exports.resetUsersCollection = resetUsersCollection;
const resetApiCollection = async (_, res) => {
    if (process.env.NODE_ENV !== "testing") {
        (0, index_1.badRequestError)(res, "Can only seed db in testing");
        return;
    }
    else {
        await ApiCollection_1.default.collection.drop();
        res.status(200).json({ msg: "DB reset!" });
    }
};
exports.resetApiCollection = resetApiCollection;
const { name, email, password } = mockUser_1.mockUser;
const seedUsersCollection = async (_, res) => {
    if (process.env.NODE_ENV !== "testing") {
        (0, index_1.badRequestError)(res, "Can only seed db in testing");
        return;
    }
    else {
        await UserCollection_1.default.create({ name, email, password });
        res.status(201).json({ msg: "DB seeded!" });
    }
};
exports.seedUsersCollection = seedUsersCollection;
const seedApiCollection = async (req, res) => {
    if (process.env.NODE_ENV !== "testing") {
        (0, index_1.badRequestError)(res, "Can only seed db in testing");
        return;
    }
    else {
        try {
            const user = await (0, validateUser_1.default)(req, res);
            if (!user) {
                (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
                return;
            }
            Object.keys(mockApis_1.mockApis).forEach(async (_, index) => {
                await ApiCollection_1.default.create({
                    url: mockApis_1.mockApis[index].url,
                    host: mockApis_1.mockApis[index].host,
                    status: mockApis_1.mockApis[index].status,
                    lastPinged: mockApis_1.mockApis[index].lastPinged,
                    monitoring: mockApis_1.mockApis[index].monitoring,
                    createdBy: user._id,
                });
            });
            res.status(200).json({ msg: "DB seeded!" });
        }
        catch (error) {
            return error;
        }
    }
};
exports.seedApiCollection = seedApiCollection;
//# sourceMappingURL=seedDb.js.map