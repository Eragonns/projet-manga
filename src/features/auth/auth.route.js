import express from "express";
import * as authController from "./auth.controller.js";
import validate from "../../middlewares/validation.middleware.js";
import {
  LoginUserSchema,
  RegisterUserSchema
} from "../../users/schema.user.js";
import authenticateUser from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(RegisterUserSchema), authController.register);
router.post("/login", validate(LoginUserSchema), authController.login);

// router.get(
//   "/dashboard/:id",
//   validate(authenticateUser),
//   authController.dashboard
// );

export default router;
