import { UnauthorizedError } from "../errors/index.js";

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId !== resourceUserId.toString()) {
    throw new UnauthorizedError("Accès à cette route non autorisé");
  }
};

export { checkPermissions };
