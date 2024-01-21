const Joi = require("joi");

// ==============    createContactSchema    =========

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
})
  .min(3)
  .max(3);

// ==============    updateContactSchema    =========

const updateContactSchema = Joi.object({
  name: Joi.string().trim().pattern(new RegExp("^[a-zA-Z ]+$")).min(2).max(30),

  email: Joi.string().trim().email(),

  phone: Joi.string()
    .pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$"))
    .trim()
    .min(14)
    .max(14),
})
  .min(1)
  .max(3)
  .messages({
    "object.min": "Body must have at least one field",
  });

module.exports = { createContactSchema, updateContactSchema };
