import express from "express";
import * as userController from "./controller.user.js";
import authenticateUser from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validation.middleware.js";
import { UpdateProfileSchema } from "../../schemas/userProfil.schema.js";
import upload from "../../middlewares/multer.middleware.js";
import authorizeRoles from "../../middlewares/admin.middleware.js";

const router = express.Router();

router
  .route("/profile")
  .get(authenticateUser, authorizeRoles("user"), userController.getProfile);
router
  .route("/profile/update")
  .put(
    upload,
    authenticateUser,
    validate({ bodySchema: UpdateProfileSchema }),
    userController.updateProfile
  );
router
  .route("/profile/change-password")
  .put(authenticateUser, userController.changePassword);

export default router;
