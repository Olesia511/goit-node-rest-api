const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../models/Users.js");
const HttpError = require("../helpers/HttpError.js");
const controllersWrapper = require("../helpers/controllersWrapper.js");

const { JWT_SECRET } = process.env;

const signupCtrl = async (req, res) => {
  const { email, password } = req.body;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.json({
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

module.exports = {
  signupCtrl: controllersWrapper(signupCtrl),
  signinCtrl: controllersWrapper(signinCtrl),
  getCurrentCtrl: controllersWrapper(getCurrentCtrl),
  logoutCtrl: controllersWrapper(logoutCtrl),
  updateSubscriptionCtrl: controllersWrapper(updateSubscriptionCtrl),
};
