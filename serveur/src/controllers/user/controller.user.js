import { StatusCodes } from "http-status-codes";
import * as userService from "../../services/user.service.js";
import UserProfile from "../../models/userProfil.model.js";
import User from "../../models/user.model.js";
import { formatImage } from "../../middlewares/multer.middleware.js";
import { v2 as cloudinary } from "cloudinary";

const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }
    const userProfile = await UserProfile.findOne({ userId: req.user.userId });
    if (!userProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Profil utilisateur non trouvé" });
    }
    const responseUserData = {
      pseudo: user.pseudo,
      email: user.email,

      name: userProfile.name,
      firstName: userProfile.firstName,
      description: userProfile.description,
      age: userProfile.age,
      genre: userProfile.genre,
      profileImage: userProfile.profileImage
    };
    res.status(StatusCodes.OK).json({
      user: responseUserData
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur serveur" });
  }
};

const updateProfile = async (req, res) => {
  console.log("req:", req.user);
  console.log("req.body:", req.body);
  const { pseudo, name, firstName, email, description, age, genre } = req.body;

  const userId = req.user.userId;
  console.log("User ID:", userId);

  try {
    const currentUser = await UserProfile.findOne({ userId: userId });
    if (!currentUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Profil utilisateur non trouvé" });
    }
    let profileImageUrl;

    if (currentUser.profileImage) {
      const publicId = currentUser.profileImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`profileImage/${publicId}`);
    }

    if (req.files && req.files.profileImage) {
      console.log("Nouvelle image reçue:", req.files.profileImage[0]);
      const imageBase = formatImage(req.files.profileImage[0]);
      const result = await cloudinary.uploader.upload(imageBase, {
        folder: "profileImage",
        public_id: `profile_${userId}`
      });
      profileImageUrl = result.secure_url;
      console.log("Nouvelle image téléchargée:", profileImageUrl);
    } else {
      console.log("Aucune nouvelle image reçue.");
    }
    const updatedUser = await UserProfile.findOneAndUpdate(
      { userId: userId },
      {
        pseudo: pseudo?.trim(),
        name: name?.trim(),
        firstName: firstName?.trim(),
        email: email?.trim(),
        description: description?.trim(),
        age,
        genre,
        profileImage: profileImageUrl || currentUser.profileImage
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Utilisateur non trouvé" });
    }
    console.log("Updated User:", updatedUser);
    res.status(StatusCodes.OK).json({ user: updatedUser });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur serveur" });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "L'ancien mot de passe est incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ msg: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Erreur serveur" });
  }
};

export { getProfile, updateProfile, changePassword };
