interface UserBaseData {
  email: string;
}

interface RegisterUserData extends UserBaseData {
  name: string;
  password: string;
}

interface LoginUserData extends UserBaseData {
  password: string;
}

interface UserDataResponse extends UserBaseData {
  name: string;
}

type UpdateUserData = UserDataResponse;

interface AuthUserResponse {
  user: UserDataResponse;
  token: string;
}

export {
  UserBaseData,
  RegisterUserData,
  LoginUserData,
  AuthUserResponse,
  UserDataResponse,
  UpdateUserData,
};
