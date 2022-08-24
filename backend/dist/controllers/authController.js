"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.updateUser = exports.login = exports.register = void 0;
const cookies_1 = require("constants/cookies");
const keys_1 = require("constants/keys");
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("errors/index");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateKeys_1 = require("middleware/validateKeys");
const validateUser_1 = __importDefault(require("middleware/validateUser"));
const UserCollection_1 = __importDefault(require("models/UserCollection"));
dotenv_1.default.config();
const { JWT_ACCESS_TOKEN_LIFETIME, JWT_REFRESH_TOKEN_LIFETIME } = process.env;
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
        const accessToken = user.createJWT(JWT_ACCESS_TOKEN_LIFETIME);
        const refreshToken = user.createJWT(JWT_REFRESH_TOKEN_LIFETIME);
        res
            .cookie(cookies_1.cookieName, refreshToken, {
            maxAge: cookies_1.cookieExpiryTime,
            secure: cookies_1.cookieSecureSetting,
            httpOnly: cookies_1.cookieHttpOnlySetting,
            sameSite: cookies_1.cookieSameSiteSetting,
        })
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({
            user: {
                email: user.email,
                name: user.name,
            },
            accessToken,
        });
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
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
        const accessToken = user.createJWT(JWT_ACCESS_TOKEN_LIFETIME);
        const refreshToken = user.createJWT(JWT_REFRESH_TOKEN_LIFETIME);
        user.password = "";
        res
            .cookie(cookies_1.cookieName, refreshToken, {
            maxAge: cookies_1.cookieExpiryTime,
            secure: cookies_1.cookieSecureSetting,
            httpOnly: cookies_1.cookieHttpOnlySetting,
            sameSite: cookies_1.cookieSameSiteSetting,
        })
            .status(http_status_codes_1.StatusCodes.OK)
            .json({
            user: {
                email: user.email,
                name: user.name,
            },
            accessToken,
        });
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
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
        const accessToken = user.createJWT(JWT_ACCESS_TOKEN_LIFETIME);
        const refreshToken = user.createJWT(JWT_REFRESH_TOKEN_LIFETIME);
        res
            .cookie(cookies_1.cookieName, refreshToken, {
            maxAge: cookies_1.cookieExpiryTime,
            secure: cookies_1.cookieSecureSetting,
            httpOnly: cookies_1.cookieHttpOnlySetting,
            sameSite: cookies_1.cookieSameSiteSetting,
        })
            .status(http_status_codes_1.StatusCodes.OK)
            .json({
            user: {
                email: user.email,
                name: user.name,
            },
            accessToken,
        });
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.updateUser = updateUser;
const refreshAccessToken = async (req, res) => {
    try {
        if (!req.cookies) {
            (0, index_1.badRequestError)(res, "Cookies missing");
            return;
        }
        const refreshToken = req.cookies[cookies_1.cookieName];
        if (!refreshToken) {
            (0, index_1.unAuthenticatedError)(res, "Invalid credentials, please login again");
            return;
        }
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
        }
        catch (error) {
            (0, index_1.unAuthenticatedError)(res, "Please login again");
            return;
        }
        const user = await UserCollection_1.default.findOne({ _id: payload.userId });
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid user credentials");
            return;
        }
        const newAccessToken = user.createJWT(JWT_ACCESS_TOKEN_LIFETIME);
        res.status(http_status_codes_1.StatusCodes.OK).json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.log(error);
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.refreshAccessToken = refreshAccessToken;
//# sourceMappingURL=authController.js.map