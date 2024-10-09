import { UnauthenticatedError } from "../errors/index.js";
import { verifyJWT } from "../utils/token.util.js";

const authenticateUser = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer"))
    throw new UnauthenticatedError("Pas de token fourni");

  const token = authHeader.split(" ")[1];
  try {
    const { userId, role } = verifyJWT(token);

    req.user = {
      userId,
      role
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalide");
  }
};

export default authenticateUser;
