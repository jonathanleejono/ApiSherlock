import { BadRequestError, NotFoundError, UnAuthenticatedError } from "errors";
import {
  AuthUserResponse,
  LoginUserData,
  RegisterUserData,
  UpdateUserData,
  UserDataResponse,
} from "interfaces/users";
import { usersKey } from "constants/keys";
import { Buffer } from "buffer";
import { RestRequest, DefaultBodyType, PathParams } from "msw";
import { removeUserFromLocalStorage } from "utils/localStorage";

// the password is needed to be retrieved and compared
let userInMemory: RegisterUserData = { name: "", email: "", password: "" };

const persist = () =>
  localStorage.setItem(usersKey, JSON.stringify(userInMemory));

const load = () => {
  const getUsersKey = localStorage.getItem(usersKey);
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

function validateUserForm({ name, email, password }: RegisterUserData) {
  if (!name || !email || !password) {
    const error = new BadRequestError("Please fill out all fields");
    throw error;
  }
}

// REGISTER
async function registerUser({
  name,
  email,
  password,
}: RegisterUserData): Promise<AuthUserResponse> {
  validateUserForm({ name, email, password });
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
  userInMemory = { name, email, password: passwordHash };
  persist();
  const user = await getUser();
  const token = generateToken(_id);
  return { user, token };
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
      token: generateToken(_id),
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
  return { user: userInMemory, token: generateToken(_id) };
}

// DELETE
async function deleteUser() {
  checkUserExists();
  removeUserFromLocalStorage();
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
  const { name, email } = user;
  return { name, email };
}

function generateToken(userId: string) {
  // make sure to install Buffer browser dependency
  // and import {Buffer} at the top
  const token: string = Buffer.from(userId, "utf8").toString("base64");
  return token;
}

const getToken = (req: RestRequest<DefaultBodyType, PathParams<string>>) =>
  req.headers.get("Authorization")?.replace("Bearer ", "");

async function getUserByToken(
  req: RestRequest<DefaultBodyType, PathParams<string>>
) {
  const token = getToken(req);
  if (!token) {
    const error = new UnAuthenticatedError("A token must be provided");
    throw error;
  }
  let userId;
  try {
    userId = Buffer.from(token, "base64").toString("utf8");

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

export function userHash(str: string) {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
}

async function resetDB() {
  userInMemory = { name: "", email: "", password: "" };
  persist();
}

export {
  loginUser,
  registerUser,
  getUserByToken,
  updateUser,
  deleteUser,
  resetDB,
};
