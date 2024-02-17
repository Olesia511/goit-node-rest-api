const express = require("express");
const validateBody = require("../helpers/validateBody.js");
const authVerification = require("../helpers/authentication.js");
const upload = require("../helpers/uploadFiles.js");

const {
  userSignSchema,
  userSubscriptionSchema,
  userUpdateAvatarSchema,
  userEmailSchema,
} = require("../models/Users.js");

const {
  signupCtrl,
  signinCtrl,
  getCurrentCtrl,
  logoutCtrl,
  updateSubscriptionCtrl,
  updateAvatarsCtrl,
  mailVerificationCtrl,
  resendVerificationEmailCtrl,
} = require("../controllers/usersControllers.js");

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(userSignSchema), signupCtrl);

usersRouter.post("/login", validateBody(userSignSchema), signinCtrl);

usersRouter.post("/logout", authVerification, logoutCtrl);

usersRouter.get("/current", authVerification, getCurrentCtrl);

usersRouter.get("/verify/:verificationToken", mailVerificationCtrl);

usersRouter.post(
  "/verify",
  validateBody(userEmailSchema),
  resendVerificationEmailCtrl
);

usersRouter.patch(
  "/",
  authVerification,
  validateBody(userSubscriptionSchema),
  updateSubscriptionCtrl
);

usersRouter.patch(
  "/avatars",
  upload.single("avatarURL"),
  authVerification,
  validateBody(userUpdateAvatarSchema),
  updateAvatarsCtrl
);

module.exports = usersRouter;
