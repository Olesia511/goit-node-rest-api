const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Joi = require("joi");
const { errStatus, updateOptions, emptyObj } = require("./contactsHooks");

const regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const arrSubscription = ["starter", "pro", "business"];

//====== mongoose schema   =====

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      minlength: 5,
    },
    email: {
      type: String,
      match: regexEmail,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
    },
    avatarURL: {
      type: String,
    },
  },
  { versionKey: false, timestamps: false }
);

userSchema.post("save", errStatus);

userSchema.pre("findOneAndUpdate", updateOptions);
userSchema.pre("findOneAndUpdate", emptyObj);

userSchema.post("findOneAndUpdate", errStatus);

//====== Joi schema sign up / sign in   =====

const userSignSchema = Joi.object({
  password: Joi.string().trim().min(5).max(15).required(),
  email: Joi.string().trim().pattern(regexEmail).required(),
});

const userSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .trim()
    .valid(...arrSubscription)
    .required(),
});

const userUpdateAvatarSchema = Joi.object({
  avatarURL: Joi.object({
    avatarURL: Joi.string().uri().required(),
  }),
});

const User = model("user", userSchema);

module.exports = {
  User,
  userSignSchema,
  userSubscriptionSchema,
  userUpdateAvatarSchema,
};
