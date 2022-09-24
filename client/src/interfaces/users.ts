interface UserBaseData {
  email: string;
}

interface RegisterUserData extends UserBaseData {
  name: string;
  password: string;
  timezoneGMT: number;
}

interface LoginUserData extends UserBaseData {
  password: string;
}

interface UserDataResponse extends UserBaseData {
  id?: string;
  name: string;
  timezoneGMT: number;
}

type UpdateUserData = UserDataResponse;

interface AuthUser {
  user: UserDataResponse;
}

interface AuthUserResponse extends AuthUser {
  accessToken: string;
}

export {
  UserBaseData,
  RegisterUserData,
  LoginUserData,
  AuthUser,
  AuthUserResponse,
  UserDataResponse,
  UpdateUserData,
};
