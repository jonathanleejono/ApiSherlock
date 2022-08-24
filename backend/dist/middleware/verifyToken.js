"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token || "";
    try {
        if (!token) {
            return res.status(401).json("You need to Login");
        }
        const decrypt = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decrypt.userId,
        };
        next();
        return;
    }
    catch (err) {
        return res.status(500).json(err.toString());
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map