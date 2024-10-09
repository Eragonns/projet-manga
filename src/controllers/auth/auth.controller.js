import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../../errors/index.js";
import * as userService from "../../services/user.service.js";

const register = async (req, res) => {
  const user = await userService.create(req.body);
  const token = user.createAccessToken();
  res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
  const user = await userService.get({ email: req.body.email });
  if (!user) throw new UnauthenticatedError("Identifiants invalides");

  const isPasswordCorrect = await user.comparePassword(req.body.password);

  if (!isPasswordCorrect)
    throw new UnauthenticatedError("Identifiants invalides");

  const token = user.createAccessToken();

  res.status(StatusCodes.OK).json({ user: { userId: user._id }, token });
};

export { register, login };
