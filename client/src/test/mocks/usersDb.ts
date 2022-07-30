import { BadRequestError, NotFoundError } from "../../errors";

const usersKey = "user";
let users = {};

const persist = () => localStorage.setItem(usersKey, JSON.stringify(users));

const load = () => {
  const getUsersKey = localStorage.getItem(usersKey);
  const _usersKey: string = getUsersKey !== null ? getUsersKey : "";
  Object.assign(users, JSON.parse(_usersKey));
};

// initialize
try {
  load();
} catch (error) {
  persist();
  // ignore json parse error
}

const purgeUsers = () => {
  Object.keys(users).forEach((key) => {
    delete users[key];
  });
  persist();
};

function validateUserForm({ name, email, password }) {
  if (!name || !email || !password) {
    const error: BadRequestError = new BadRequestError(
      "Please fill out all fields"
    );
    error.statusCode = 400;
    throw error;
  }
}

// REGISTER
async function createUser({ _id, name, email, password }) {
  validateUserForm({ name, email, password });
  // const id = hash(email);
  if (users[_id]) {
    const error: BadRequestError = new BadRequestError(
      `Cannot create a new user with the email "${email}"`
    );
    error.statusCode = 400;
    throw error;
  }
  const passwordHash = hash(password);
  users[_id] = { _id, name, email, passwordHash };
  persist();
  const theUser = await getUserById(_id);
  return { user: await getUserById(_id), token: generateToken(_id) };
}

function showUserWithoutPassword(user) {
  const { passwordHash, ...restOfUser } = user;
  return restOfUser;
}

function generateToken(userId) {
  const token: string = Buffer.from(userId, "utf8").toString("base64");
  return token;
}

// LOGIN
async function authenticateUser({ _id, name, email, password }) {
  const userFields = { name, email, password };
  // const id = hash(email);
  validateUserForm(userFields);
  const user = users[_id] || {};
  if (user.passwordHash === hash(password)) {
    return {
      user: showUserWithoutPassword(user),
      token: generateToken(_id),
    };
  }
  const error: BadRequestError = new BadRequestError("Invalid credentials");
  error.statusCode = 400;
  throw error;
}

function checkUserExists(_id: string) {
  load();
  if (!users[_id]) {
    const error: NotFoundError = new NotFoundError(
      `No user with the id "${_id}"`
    );
    error.statusCode = 404;
    throw error;
  }
}

async function getUserById(_id: string) {
  checkUserExists(_id);
  return showUserWithoutPassword(users[_id]);
}

async function updateUser(_id: string, updates) {
  checkUserExists(_id);
  Object.assign(users[_id], updates);
  persist();
  return { user: getUserById(_id), token: generateToken(_id) };
}

async function deleteUser(_id: string) {
  checkUserExists(_id);
  delete users[_id];
  persist();
}

function hash(str) {
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
