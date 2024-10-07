import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../../errors/index.js";
import * as usersServices from "../../users/service.user.js";

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

  res.status(StatusCodes.OK).json({ user: { userId: user._id }, token });
};

export { register, login };
