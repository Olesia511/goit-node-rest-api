const Joi = require("joi");

function trimValidate(string, msg, key) {
  const trimmedStr = string.trim();
  if (trimmedStr !== string) {
    return msg.error(`string.custom.${key}`);
  }
  return trimmedStr;
}

const validateMessages = {
  "object.unknown": "Only 'name', 'email', and 'phone' keys are allowed",

  "object.min": "Body must have at least one field",

  "object.max":
    "No more than three fields 'name', 'email', and 'phone' are allowed",

  "string.custom.name":
    "Name may not contain any spaces at the beginning or end.",

  "string.custom.email":
    "Email may not contain any spaces at the beginning or end.",

  "string.custom.phone":
    "Phone may not contain any spaces at the beginning or end.",

  "string.empty": "Field {#label} is not allowed to be empty.",

  "any.required": "Field {#label} is required.",
};

function stringPatternBaseMsg(keyObj) {
  switch (keyObj) {
    case "name":
      return "The name must consist only of letters of the English alphabet and have from 2 to 30 characters.";
    case "email":
      return "Email must contain @ and end with .com or .net. Example: 'dui.Fusce.diam@Donec.com'";
    case "phone":
      return "Invalid phone number format. It should be like (111) 222-4444";

    default:
      return null;
  }
}

// ==============    createContactSchema    =========

const createContactSchema = Joi.object({
  name: Joi.string()

    .custom((str, msg) => trimValidate(str, msg, "name"))
    .pattern(new RegExp("^[a-zA-Z]{2}[a-zA-Z ]*$"))
    .required()
    .messages({
      "string.pattern.base": stringPatternBaseMsg("name"),
    }),

  email: Joi.string()
    .custom((str, msg) => trimValidate(str, msg, "email"))
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "string.email": stringPatternBaseMsg("email"),
    }),

  phone: Joi.string()
    .custom((str, msg) => trimValidate(str, msg, "phone"))
    .pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$"))
    .required()
    .messages({
      "string.pattern.base": stringPatternBaseMsg("phone"),
    }),
})
  .min(3)
  .max(3)
  .messages(validateMessages);

// ==============    updateContactSchema    =========

const updateContactSchema = Joi.object({
  name: Joi.string()

    .custom((str, msg) => trimValidate(str, msg, "name"))
    .pattern(new RegExp("^[a-zA-Z]{2}[a-zA-Z ]*$"))
    .messages({
      "string.pattern.base": stringPatternBaseMsg("name"),
    }),

  email: Joi.string()
    .custom((str, msg) => trimValidate(str, msg, "email"))
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "string.email": stringPatternBaseMsg("email"),
    }),

  phone: Joi.string()
    .custom((str, msg) => trimValidate(str, msg, "phone"))
    .pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$"))
    .messages({
      "string.pattern.base": stringPatternBaseMsg("phone"),
    }),
})
  .min(1)
  .max(3)
  .messages(validateMessages);

module.exports = { createContactSchema, updateContactSchema };
