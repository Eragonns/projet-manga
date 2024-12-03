import { UnauthenticatedError } from "../errors/index.js";
import { verifyJWT } from "../utils/token.util.js";

const authenticateUser = (req, _res, next) => {
  if (req.method === "OPTIONS") return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer"))
    throw new UnauthenticatedError("Pas de token fourni");

  const token = authHeader.split(" ")[1];
  try {
    const { userId, role } = verifyJWT(token);
    console.log("Token decoded data:", { userId, role });
    if (!userId || !role)
      throw new UnauthenticatedError("Données utilisatuer invalides");

    req.user = {
      userId,
      role
    };
    console.log("Authenticated User ID:", req.user.userId);
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalide");
  }
};

export default authenticateUser;
