"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthUser = exports.updateUser = exports.login = exports.register = void 0;
const envVars_1 = require("constants/envVars");
const user_1 = require("constants/options/user");
const index_1 = require("errors/index");
const http_status_codes_1 = require("http-status-codes");
const UserCollection_1 = __importDefault(require("models/UserCollection"));
const getUser_1 = __importDefault(require("utils/getUser"));
const validateKeysValues_1 = require("utils/validateKeysValues");
const register = async (req, res) => {
    if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Invalid register, can only input: `, user_1.validRegisterKeys))
        return;
    const { email } = req.body;
    const emailAlreadyExists = await UserCollection_1.default.findOne({ email });
    if (emailAlreadyExists) {
        (0, index_1.badRequestError)(res, "Please use a different email");
        return;
    }
    const user = new UserCollection_1.default(req.body);
    await user.validate();
    await UserCollection_1.default.create(user);
    const accessToken = user.createJWT(envVars_1.JWT_ACCESS_TOKEN_LIFETIME);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            timezoneGMT: user.timezoneGMT,
        },
        accessToken,
    });
};
exports.register = register;
const login = async (req, res) => {
    if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Invalid login, can only input: `, user_1.validLoginKeys))
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
    const accessToken = user.createJWT(envVars_1.JWT_ACCESS_TOKEN_LIFETIME);
    user.password = "";
    res.status(http_status_codes_1.StatusCodes.OK).json({
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            timezoneGMT: user.timezoneGMT,
        },
        accessToken,
    });
};
exports.login = login;
const updateUser = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, index_1.unAuthenticatedError)(res, "Invalid Credentials");
        return;
    }
    if (!(0, validateKeysValues_1.validKeys)(res, Object.keys(req.body), `Invalid update profile, can only input: `, user_1.validUpdateUserKeys))
        return;
    const { email } = req.body;
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
    user.password = "";
    const accessToken = user.createJWT(envVars_1.JWT_ACCESS_TOKEN_LIFETIME);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            timezoneGMT: user.timezoneGMT,
        },
        accessToken,
    });
};
exports.updateUser = updateUser;
const getAuthUser = async (req, res) => {
    const user = await (0, getUser_1.default)(req, res);
    if (!user) {
        (0, index_1.unAuthenticatedError)(res, "User not found!");
        return;
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        id: user._id,
        name: user.name,
        email: user.email,
        timezoneGMT: user.timezoneGMT,
    });
};
exports.getAuthUser = getAuthUser;
//# sourceMappingURL=authController.js.map