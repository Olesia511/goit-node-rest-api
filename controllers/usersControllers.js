const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../helpers/sendEmail.js");

const { User } = require("../models/Users.js");
const HttpError = require("../helpers/HttpError.js");
const controllersWrapper = require("../helpers/controllersWrapper.js");
const gravatar = require("gravatar");

const { JWT_SECRET } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const signupCtrl = async (req, res) => {
  const { email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();
  const avatarURL = gravatar.url(email, { s: "250", d: "robohash" }, true);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  await sendEmail(email, verificationToken);

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

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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

const mailVerificationCtrl = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "Email not found or already verify");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({ message: "Verification successful" });
};

const resendVerificationEmailCtrl = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  await sendEmail(email, user.verificationToken);

  res.json({ message: "Verification email sent" });
};

module.exports = {
  signupCtrl: controllersWrapper(signupCtrl),
  signinCtrl: controllersWrapper(signinCtrl),
  getCurrentCtrl: controllersWrapper(getCurrentCtrl),
  logoutCtrl: controllersWrapper(logoutCtrl),
  updateSubscriptionCtrl: controllersWrapper(updateSubscriptionCtrl),
  updateAvatarsCtrl: controllersWrapper(updateAvatarsCtrl),
  mailVerificationCtrl: controllersWrapper(mailVerificationCtrl),
  resendVerificationEmailCtrl: controllersWrapper(resendVerificationEmailCtrl),
};
