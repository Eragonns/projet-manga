import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../../errors/index.js";
import * as userService from "../../services/user.service.js";
import userProfilModel from "../../models/userProfil.model.js";

const register = async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await userService.create({ pseudo, email, password });
    const token = user.createAccessToken();

    const userProfile = new userProfilModel({
      userId: user._id,
      pseudo: user.pseudo,
      email: user.email,
      name: "",
      firstName: "",
      description: "",
      age: null,
      genre: [],
      profileImage: ""
    });
    await userProfile.save();

    const responseData = {
      user: { userId: user._id, role: user.role },
      token
    };

    console.log("Response Data:", JSON.stringify(responseData, null, 2));

    res
      .status(StatusCodes.CREATED)
      .json({ user: { userId: user._id, role: user.role }, token });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur serveur" });
  }
};

const login = async (req, res) => {
  const user = await userService.get({ email: req.body.email });
  if (!user) throw new UnauthenticatedError("Identifiants invalides");

  const isPasswordCorrect = await user.comparePassword(req.body.password);

  if (!isPasswordCorrect)
    throw new UnauthenticatedError("Identifiants invalides");

  const token = user.createAccessToken();

  const responseData = {
    user: { userId: user._id, role: user.role },
    token
  };

  console.log("Response Data:", JSON.stringify(responseData, null, 2));

  res
    .status(StatusCodes.OK)
    .json({ user: { userId: user._id, role: user.role }, token });
};

export { register, login };
