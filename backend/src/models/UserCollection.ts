import mongoose, { Model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserDocument from "models/UserDocument";
import { timezoneOffsets } from "constants/timezoneOffsets";

const UserSchema: Schema<UserDocument> = new mongoose.Schema({
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
      validator: validator.isEmail,
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
    enum: timezoneOffsets,
    default: 0,
  },
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths())
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function (jwtExpirationTime: string) {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: jwtExpirationTime,
  });
};

const comparePassword = async function (
  inputPassword: string,
  dbPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(inputPassword, dbPassword);
  return isMatch;
};

UserSchema.methods.comparePassword = comparePassword;

const UserCollection: Model<UserDocument> = mongoose.model("User", UserSchema);

export default UserCollection;
