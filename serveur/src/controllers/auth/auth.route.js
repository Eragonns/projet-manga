import express from "express";

import * as authController from "./auth.controller.js";
import validate from "../../middlewares/validation.middleware.js";
import {
  LoginUserSchema,
  RegisterUserSchema
} from "../../schemas/user.schema.js";

const router = express.Router();

router.post(
  "/register",
  validate({ bodySchema: RegisterUserSchema }),
  authController.register
);
router.post(
  "/login",
  validate({ bodySchema: LoginUserSchema }),
  authController.login
);

export default router;
