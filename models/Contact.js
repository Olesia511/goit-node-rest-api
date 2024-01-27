const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const Joi = require("joi");

const { errStatus, updateOptions, emptyObj } = require("./contactsHooks");

// ==============    model, Schema mongoose  =========

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

contactSchema.post("save", errStatus);

contactSchema.pre("findOneAndUpdate", updateOptions);
contactSchema.pre("findOneAndUpdate", emptyObj);

contactSchema.post("findOneAndUpdate", errStatus);

const Contact = model("contact", contactSchema);

// ==============    createContactSchema JOI   =========

const createContactSchema = Joi.object({
  name: Joi.string()
    .trim()
    .pattern(new RegExp("^[a-zA-Z ]+$"))
    .min(2)
    .max(30)
    .required(),

  email: Joi.string().trim().email().required(),

  phone: Joi.string()
    .trim()
    .pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$"))
    .min(14)
    .max(14)
    .required(),

  favorite: Joi.boolean(),
})
  .min(3)
  .max(4);

// ==============    updateContactSchema  JOI  =========

const updateContactSchema = Joi.object({
  name: Joi.string().trim().pattern(new RegExp("^[a-zA-Z ]+$")).min(2).max(30),

  email: Joi.string().trim().email(),

  phone: Joi.string()
    .pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$"))
    .trim()
    .min(14)
    .max(14),

  favorite: Joi.boolean(),
})
  .min(1)
  .max(4)
  .messages({
    "object.min": "Body must have at least one field",
  });

// ==============    favoriteContactSchema  JOI  =========

const favoriteContactSchema = Joi.object({ favorite: Joi.boolean().required() })
  .min(1)
  .max(1);

module.exports = {
  Contact,
  createContactSchema,
  updateContactSchema,
  favoriteContactSchema,
};
