const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
require("dotenv").config();

const { User } = require("../models/Users.js");
const HttpError = require("../helpers/HttpError.js");
const controllersWrapper = require("../helpers/controllersWrapper.js");
const gravatar = require("gravatar");

const { JWT_SECRET } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const signupCtrl = async (req, res) => {
  const { email, password } = req.body;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email, { s: "250", d: "robohash" }, true);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signinCtrl = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id, subscription } = user;
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "20h" });

  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: { email, subscription },
  });
};

const getCurrentCtrl = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logoutCtrl = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  return res.status(204).json();
};

const updateSubscriptionCtrl = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;

  await User.findByIdAndUpdate(_id, req.body);

  res.json({
    user: { email, subscription },
  });
};

const updateAvatarsCtrl = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);

  const image = await Jimp.read(newPath);

  await image.cover(250, 250).write(newPath);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  signupCtrl: controllersWrapper(signupCtrl),
  signinCtrl: controllersWrapper(signinCtrl),
  getCurrentCtrl: controllersWrapper(getCurrentCtrl),
  logoutCtrl: controllersWrapper(logoutCtrl),
  updateSubscriptionCtrl: controllersWrapper(updateSubscriptionCtrl),
  updateAvatarsCtrl: controllersWrapper(updateAvatarsCtrl),
};
