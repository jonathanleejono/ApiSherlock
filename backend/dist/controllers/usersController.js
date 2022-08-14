"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const index_1 = require("errors/index");
const UserCollection_1 = __importDefault(require("models/UserCollection"));
const validateUser_1 = __importDefault(require("middleware/validateUser"));
const validateKeys_1 = require("middleware/validateKeys");
const keys_1 = require("constants/keys");
const register = async (req, res) => {
    try {
        (0, validateKeys_1.validateInputKeys)(req, res, `Invalid register, can only use: `, keys_1.validRegisterKeys);
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            (0, index_1.badRequestError)(res, "Please provide all values");
            return;
        }
        const userAlreadyExists = await UserCollection_1.default.findOne({ email });
        if (userAlreadyExists) {
            (0, index_1.badRequestError)(res, "Please use a different email");
            return;
        }
        const user = await UserCollection_1.default.create({ name, email, password });
        const token = user.createJWT();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            user: {
                email: user.email,
                name: user.name,
            },
            token,
        });
    }
    catch (error) {
        return error;
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        (0, validateKeys_1.validateInputKeys)(req, res, `Invalid login, can only use: `, keys_1.validLoginKeys);
        const { email, password } = req.body;
        if (!email || !password) {
            (0, index_1.badRequestError)(res, "Please provide all values");
            return;
        }
        const user = await UserCollection_1.default.findOne({ email }).select("+password");
        if (!user || !user.password) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const isPasswordCorrect = await user.comparePassword(password, user.password);
        if (!isPasswordCorrect) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const token = user.createJWT();
        user.password = "";
        res.status(http_status_codes_1.StatusCodes.OK).json({
            user: {
                email: user.email,
                name: user.name,
            },
            token,
        });
    }
    catch (error) {
        return error;
    }
};
exports.login = login;
const updateUser = async (req, res) => {
    try {
        const user = await (0, validateUser_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        (0, validateKeys_1.validateInputKeys)(req, res, `Invalid update, can only update: `, keys_1.validUpdateKeys);
        const { email, name } = req.body;
        if (!email || !name) {
            (0, index_1.badRequestError)(res, "Please provide all values");
            return;
        }
        user.email = email;
        user.name = name;
        await user.save();
        const token = user.createJWT();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            user: {
                email: user.email,
                name: user.name,
            },
            token,
        });
    }
    catch (error) {
        return error;
    }
};
exports.updateUser = updateUser;
//# sourceMappingURL=usersController.js.map