import { UnauthorizedError } from "../errors/index.js";

const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    const userRole = req.user.role;
    console.log("Role utilisateur :", userRole);
    console.log("Rôles autorisés :", roles);
    if (!roles.includes(userRole)) {
      throw new UnauthorizedError("Accès non autorisé");
    }
    next();
  };
};

export default authorizeRoles;
