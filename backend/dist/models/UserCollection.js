"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const timezoneOffsets_1 = require("constants/options/timezoneOffsets");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        validate: {
            validator: validator_1.default.isEmail,
            message: "Please provide a valid email",
        },
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
        select: false,
    },
    timezoneGMT: {
        type: Number,
        enum: timezoneOffsets_1.timezoneOffsets,
        default: 0,
    },
});
UserSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
UserSchema.methods.createJWT = function (jwtExpirationTime) {
    return jsonwebtoken_1.default.sign({ userId: this._id }, process.env.JWT_SECRET, {
        expiresIn: jwtExpirationTime,
    });
};
const comparePassword = async function (inputPassword, dbPassword) {
    const isMatch = await bcryptjs_1.default.compare(inputPassword, dbPassword);
    return isMatch;
};
UserSchema.methods.comparePassword = comparePassword;
const UserCollection = mongoose_1.default.model("User", UserSchema);
exports.default = UserCollection;
//# sourceMappingURL=UserCollection.js.map