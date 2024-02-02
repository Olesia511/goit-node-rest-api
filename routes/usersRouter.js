const express = require("express");
const validateBody = require("../helpers/validateBody.js");
const authVerification = require("../helpers/authentication.js");

const {
  userSignSchema,
  userSubscriptionSchema,
} = require("../models/Users.js");

const {
  signupCtrl,
  signinCtrl,
  getCurrentCtrl,
  logoutCtrl,
  updateSubscriptionCtrl,
} = require("../controllers/usersControllers.js");

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(userSignSchema), signupCtrl);

usersRouter.post("/login", validateBody(userSignSchema), signinCtrl);

usersRouter.post("/logout", authVerification, logoutCtrl);

usersRouter.get("/current", authVerification, getCurrentCtrl);

usersRouter.patch(
  "/",
  authVerification,
  validateBody(userSubscriptionSchema),
  updateSubscriptionCtrl
);

module.exports = usersRouter;
