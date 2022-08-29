"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.updateUser = exports.login = exports.register = void 0;
const cookies_1 = require("constants/cookies");
const keys_1 = require("constants/keys");
const timezoneOffsets_1 = require("constants/timezoneOffsets");
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("errors/index");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserCollection_1 = __importDefault(require("models/UserCollection"));
const validateKeys_1 = require("utils/validateKeys");
const validateUserExists_1 = __importDefault(require("utils/validateUserExists"));
dotenv_1.default.config();
const { JWT_ACCESS_TOKEN_LIFETIME, JWT_REFRESH_TOKEN_LIFETIME } = process.env;
const register = async (req, res) => {
    try {
        if (!(0, validateKeys_1.validKeys)(res, Object.keys(req.body), `Invalid register, can only use: `, keys_1.validRegisterKeys))
            return;
        const { name, email, password, timezoneGMT } = req.body;
        if (!name || !email || !password) {
            (0, index_1.badRequestError)(res, "Please provide all values");
            return;
        }
        if (!timezoneOffsets_1.timezoneOffsets.includes(timezoneGMT)) {
            (0, index_1.badRequestError)(res, `Invalid timezone, please select one of: ${timezoneOffsets_1.timezoneOffsets}`);
            return;
        }
        const emailAlreadyExists = await UserCollection_1.default.findOne({ email });
        if (emailAlreadyExists) {
            (0, index_1.badRequestError)(res, "Please use a different email");
            return;
        }
        const user = await UserCollection_1.default.create({
            name,
            email,
            password,
            timezoneGMT,
        });
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
                timezoneGMT: user.timezoneGMT,
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
        if (!(0, validateKeys_1.validKeys)(res, Object.keys(req.body), `Invalid login, can only use: `, keys_1.validLoginKeys))
            return;
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
                timezoneGMT: user.timezoneGMT,
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
        const user = await (0, validateUserExists_1.default)(req, res);
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        if (!(0, validateKeys_1.validKeys)(res, Object.keys(req.body), `Invalid update, can only update: `, keys_1.validUpdateKeys))
            return;
        const { email, name, timezoneGMT } = req.body;
        if (!email || !name || !timezoneGMT) {
            (0, index_1.badRequestError)(res, "Please provide all values");
            return;
        }
        if (!timezoneOffsets_1.timezoneOffsets.includes(timezoneGMT)) {
            (0, index_1.badRequestError)(res, `Invalid timezone, please select one of: ${timezoneOffsets_1.timezoneOffsets}`);
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
        user.timezoneGMT = timezoneGMT;
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
                timezoneGMT: user.timezoneGMT,
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