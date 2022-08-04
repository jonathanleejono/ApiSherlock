import { BadRequestError, NotFoundError } from "errors";
import {
  AuthUserResponse,
  LoginUserData,
  RegisterUserData,
  UpdateUserData,
  UserDataResponse,
} from "interfaces/users";
import { usersKey } from "test/constants/keys";

type UserOptions = {
  [key: string]: RegisterUserData;
};

let users: UserOptions = {};

const persist = () => localStorage.setItem(usersKey, JSON.stringify(users));

const load = () => {
  const getUsersKey = localStorage.getItem(usersKey);
  const _usersKey: string = getUsersKey !== null ? getUsersKey : "";
  Object.assign(users, JSON.parse(_usersKey));
};

// initialize
if (process.env.NODE_ENV === "test") {
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
async function createUser({
  name,
  email,
  password,
}: RegisterUserData): Promise<AuthUserResponse> {
  validateUserForm({ name, email, password });
  const _id = userHash(email);
  if (users[_id]) {
    const error = new BadRequestError(
      `Cannot create a new user with the email "${email}"`
    );

    throw error;
  }
  const passwordHash = userHash(password);
  users[_id] = { name, email, password: passwordHash };
  persist();
  return { user: await getUserById(_id), token: generateToken(_id) };
}

// LOGIN
async function authenticateUser({
  email,
  password,
}: LoginUserData): Promise<AuthUserResponse> {
  if (!email || !password) {
    const error = new BadRequestError("Please fill out all fields");
    throw error;
  }

  const _id = userHash(email);
  const user = users[_id] || {};

  if (!user) {
    const error = new NotFoundError(`User with id ${_id} not found`);
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
  checkUserExists(_id);
  Object.assign(users[_id], updates);
  persist();
  // need to await because getUserById is async
  return { user: await getUserById(_id), token: generateToken(_id) };
}

// DELETE
async function deleteUser(_id: string) {
  checkUserExists(_id);
  delete users[_id];
  persist();
}

function checkUserExists(_id: string) {
  load();
  if (!users[_id]) {
    const error = new NotFoundError(`No user with the id "${_id}"`);
    throw error;
  }
}

async function getUserById(_id: string): Promise<UserDataResponse> {
  checkUserExists(_id);
  const user = showUserWithoutPassword(users[_id]);
  return user;
}

function showUserWithoutPassword(user: RegisterUserData): UserDataResponse {
  const { name, email } = user;
  return { name, email };
}

function generateToken(userId: string) {
  const token: string = Buffer.from(userId, "utf8").toString("base64");
  return token;
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
  users = {};
  persist();
}

export {
  authenticateUser,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  resetDB,
};
