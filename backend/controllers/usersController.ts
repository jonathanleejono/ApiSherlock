import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index";
import User from "../models/UserCollection";

// export interface UserResponse {
//   user: { name: string; email: string };
//   token: string;
// }

const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });

  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }

  const user = await User.create({ name, email, password });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
    },
    token,
  });
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  user.password = undefined;

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      name: user.name,
    },
    token,
  });
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req?.user?.userId });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  user!.email = email;
  user!.name = name;

  await user!.save();

  const token = user!.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      email: user!.email,
      name: user!.name,
    },
    token,
  });
};

export { register, login, updateUser };
