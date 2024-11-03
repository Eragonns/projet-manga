import { UnauthorizedError } from "../errors/index.js";

const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    const userRole = req.user.role.trim();
    if (!roles.includes(userRole)) {
      throw new UnauthorizedError("Accès non autorisé");
    }
    next();
  };
};

export default authorizeRoles;
