import { UnauthorizedError } from "../errors/index.js";

const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Accès non autorisé");
    }
    next();
  };
};

export default authorizeRoles;
