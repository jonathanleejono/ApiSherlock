"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.updateUser = exports.login = exports.register = void 0;
const cookies_1 = require("constants/cookies");
const timezoneOffsets_1 = require("constants/options/timezoneOffsets");
const user_1 = require("constants/options/user");
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("errors/index");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserCollection_1 = __importDefault(require("models/UserCollection"));
const validateKeysValues_1 = require("utils/validateKeysValues");
const validateUserExists_1 = __importDefault(require("utils/validateUserExists"));
dotenv_1.default.config();
const { JWT_ACCESS_TOKEN_LIFETIME, JWT_REFRESH_TOKEN_LIFETIME } = process.env;
const register = async (req, res) => {
    try {
        if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Invalid register, can only use: `, user_1.validRegisterKeys))
            return;
        if ((0, validateKeysValues_1.emptyValuesExist)(res, Object.values(req.body)))
            return;
        const { email, timezoneGMT } = req.body;
        if (!(0, validateKeysValues_1.validValues)(res, timezoneGMT, `Invalid timezone, please select one of: `, timezoneOffsets_1.timezoneOffsets))
            return;
        const emailAlreadyExists = await UserCollection_1.default.findOne({ email });
        if (emailAlreadyExists) {
            (0, index_1.badRequestError)(res, "Please use a different email");
            return;
        }
        const user = new UserCollection_1.default(req.body);
        await user.validate();
        await UserCollection_1.default.create(user);
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
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Invalid login, can only use: `, user_1.validLoginKeys))
            return;
        if ((0, validateKeysValues_1.emptyValuesExist)(res, Object.values(req.body)))
            return;
        const { email, password } = req.body;
        const user = await UserCollection_1.default.findOne({ email }).select("+password");
        if (!user) {
            (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
            return;
        }
        const isPasswordCorrect = await user.comparePassword(password, user.password);
        if (!isPasswordCorrect) {
            (0, index_1.unAuthenticatedError)(res, "Incorrect Credentials");
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
        if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Invalid update, can only update: `, user_1.validUpdateUserKeys))
            return;
        if ((0, validateKeysValues_1.emptyValuesExist)(res, Object.values(req.body)))
            return;
        const { email, timezoneGMT } = req.body;
        if (timezoneGMT &&
            !(0, validateKeysValues_1.validValues)(res, timezoneGMT, `Invalid timezone, please select one of: `, timezoneOffsets_1.timezoneOffsets))
            return;
        if (email && user.email !== email) {
            const emailAlreadyExists = await UserCollection_1.default.findOne({ email });
            if (emailAlreadyExists) {
                (0, index_1.badRequestError)(res, "Please use a different email");
                return;
            }
        }
        Object.assign(user, req.body);
        await user.validate();
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
        (0, index_1.badRequestError)(res, error);
        return;
    }
};
exports.refreshAccessToken = refreshAccessToken;
//# sourceMappingURL=authController.js.map