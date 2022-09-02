import { Buffer } from "buffer";
import { timezoneOffsets } from "constants/timezoneOffsets";
import {
  AuthUserResponse,
  LoginUserData,
  RegisterUserData,
  UpdateUserData,
  UserDataResponse,
} from "interfaces/users";
import { DefaultBodyType, PathParams, RestRequest } from "msw";
import { testUserKey } from "test/data/testKeys";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "test/errors";

// the password is needed to be retrieved and compared
let userInMemory: RegisterUserData = {
  name: "",
  email: "",
  password: "",
  timezoneGMT: 0,
};

const persist = () =>
  localStorage.setItem(testUserKey, JSON.stringify(userInMemory));

const load = () => {
  const getUsersKey = localStorage.getItem(testUserKey);
  const _usersKey: string = getUsersKey !== null ? getUsersKey : "";
  Object.assign(userInMemory, JSON.parse(_usersKey));
};

const { NODE_ENV, REACT_APP_MSW_DEV } = process.env;

// initialize
if (NODE_ENV === "test" || REACT_APP_MSW_DEV === "on") {
  try {
    load();
  } catch (error) {
    persist();
  }
}

// REGISTER
async function registerUser({
  name,
  email,
  password,
  timezoneGMT,
}: RegisterUserData): Promise<AuthUserResponse> {
  if (!name || !email || !password || !timezoneGMT) {
    const error = new BadRequestError("Please fill out all fields");
    throw error;
  }

  if (!timezoneOffsets.includes(timezoneGMT)) {
    const error = new BadRequestError(
      `Invalid timezone, can only use: ${timezoneOffsets} `
    );
    throw error;
  }

  const _id = userHash(email);

  if (userInMemory) {
    const storedUserEmail = userInMemory.email as string;

    if (storedUserEmail && userHash(storedUserEmail) === _id) {
      const error = new BadRequestError(
        `Cannot create a new user with the email "${email}"`
      );

      throw error;
    }
  }

  const passwordHash = userHash(password);
  userInMemory = { name, email, password: passwordHash, timezoneGMT };
  persist();
  const user = await getUser();
  const accessToken = generateToken(_id);
  return { user, accessToken };
}

// LOGIN
async function loginUser({
  email,
  password,
}: LoginUserData): Promise<AuthUserResponse> {
  if (!email || !password) {
    const error = new BadRequestError("Please fill out all fields");
    throw error;
  }

  const _id = userHash(email);
  const user = userInMemory || {};

  if (!user) {
    const error = new NotFoundError(`User not found`);
    throw error;
  }
  if (user.password === userHash(password)) {
    return {
      user: showUserWithoutPassword(user),
      accessToken: generateToken(_id),
    };
  } else {
    const error = new BadRequestError("Invalid credentials");
    throw error;
  }
}

// UPDATE/PATCH
async function updateUser(
  _id: string,
  updates: Partial<UpdateUserData>
): Promise<AuthUserResponse> {
  checkUserExists();
  Object.assign(userInMemory, updates);
  persist();
  return { user: userInMemory, accessToken: generateToken(_id) };
}

// DELETE
async function deleteUser() {
  checkUserExists();
  userInMemory = { name: "", email: "", password: "", timezoneGMT: 0 };
  persist();
}

function checkUserExists() {
  load();

  if (!userInMemory) {
    const error = new NotFoundError(`No user found"`);
    throw error;
  }
}

async function getUser(): Promise<UserDataResponse> {
  checkUserExists();
  const user = showUserWithoutPassword(userInMemory);
  return user;
}

function showUserWithoutPassword(user: RegisterUserData): UserDataResponse {
  const { name, email, timezoneGMT } = user;
  return { name, email, timezoneGMT };
}

function generateToken(userId: string) {
  // make sure to install Buffer browser dependency
  // and import {Buffer} at the top
  const token: string = Buffer.from(userId, "utf8").toString("base64");
  return token;
}

const getToken = (req: RestRequest<DefaultBodyType, PathParams<string>>) =>
  req.headers.get("Authorization")?.replace("Bearer ", "");

export const cookieName = "testApiSherlockId";

async function authenticateUser(
  req: RestRequest<DefaultBodyType, PathParams<string>>
) {
  const cookie = req.cookies[cookieName];

  if (!cookie) {
    const error = new UnAuthenticatedError("A refresh token must be provided");
    throw error;
  }

  const accessToken = getToken(req);

  if (!accessToken) {
    const error = new UnAuthenticatedError("An access token must be provided");
    throw error;
  }
  let userId;
  try {
    userId = Buffer.from(accessToken, "base64").toString("utf8");

    const user = await getUser();

    const actualUserId = userHash(user.email);

    if (actualUserId !== userId) {
      const error = new UnAuthenticatedError("Unauthenticated");
      throw error;
    } else return user;
  } catch (err) {
    console.log("Get User Error: ", err);
    const error = new UnAuthenticatedError(
      "Invalid token. Please login again."
    );
    throw error;
  }
}

function userHash(str: string) {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
}

async function resetDB() {
  userInMemory = { name: "", email: "", password: "", timezoneGMT: 0 };
  persist();
}

export {
  loginUser,
  registerUser,
  getUser,
  authenticateUser,
  updateUser,
  deleteUser,
  resetDB,
  generateToken,
  userHash,
};
