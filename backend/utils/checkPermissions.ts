import { UnAuthenticatedError } from "../errors/index";

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new UnAuthenticatedError("Not authorized to access");
};

export default checkPermissions;
