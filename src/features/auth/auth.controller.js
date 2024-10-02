import { StatusCodes } from "http-status-codes";
import UnauthenticatedError from "../../errors/index.js";
// import notFound from "../../middlewares/not-found.middleware.js";

const register = async (req, res) => {
  const user = await usersServices.create(req.body);
  const token = user.createAccessToken();
  res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
  const user = await usersServices.get({ email: req.body.email });
  if (!user) throw new UnauthenticatedError("Identifiants invalides");

  const isPasswordCorrect = await user.comparePassword(req.body.password);

  if (!isPasswordCorrect)
    throw new UnauthenticatedError("Identifiants invalides");

  const token = user.createAccessToken();

  res.status(StatusCodes.OK).json({ user: { userId: user.id }, token });
};

// const dashboard = async (req, res) => {
//   const { id } = req.params;
//   const comptes = await compte.findById(id);
//   if (!comptes) throw new notFound("Compte introuvable");
//   res.status(StatusCodes.OK).json({ comptes });
// };

export { register, login };
