import { Router } from "express";
import { check, body } from "express-validator";

import * as authController from "../controllers/auth";

const router = Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),
    body(
      "password",
      "the password should only consist of numbers and characters and should be atleast five characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

export default router;
