"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.updateUser = exports.login = exports.register = void 0;
const keys_1 = require("constants/keys");
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("errors/index");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateKeys_1 = require("middleware/validateKeys");
const validateUser_1 = __importDefault(require("middleware/validateUser"));
const UserCollection_1 = __importDefault(require("models/UserCollection"));
dotenv_1.default.config();
const register = async (req, res) => {
    try {
        (0, validateKeys_1.validateInputKeys)(req, res, `Invalid register, can only use: `, keys_1.validRegisterKeys);
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            (0, index_1.badRequestError)(res, "Please provide all values");
            return;
        }
        const emailAlreadyExists = await UserCollection_1.default.findOne({ email });
        if (emailAlreadyExists) {
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
        res
            .cookie("refreshToken", token, {
            expires: new Date(Date.now() + 500000),
            secure: false,
            httpOnly: false,
            sameSite: "lax",
        })
            .status(http_status_codes_1.StatusCodes.OK)
            .json({
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
        if (user.email !== email) {
            const emailAlreadyExists = await UserCollection_1.default.findOne({ email });
            if (emailAlreadyExists) {
                (0, index_1.badRequestError)(res, "Please use a different email");
                return;
            }
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
const refreshAccessToken = async (req, res) => {
    try {
        const user = await (0, validateUser_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            (0, index_1.unAuthenticatedError)(res, "Invalid credentials, please login again");
            return;
        }
        try {
            jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
        }
        catch (error) {
            (0, index_1.unAuthenticatedError)(res, "Please login again");
            return;
        }
        const newAccessToken = user.createJWT();
        res.status(http_status_codes_1.StatusCodes.OK).json(newAccessToken);
    }
    catch (error) {
        return error;
    }
};
exports.refreshAccessToken = refreshAccessToken;
//# sourceMappingURL=usersController.js.map