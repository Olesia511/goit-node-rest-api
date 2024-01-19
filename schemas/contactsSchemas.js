const Joi = require("joi");

const createContactSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .message({ "string.pattern.base": "The name must contain only letters" })
    .min(2)
    .max(30)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .message(
      "Email must contain @ and end with .com or .net. Example: 'dui.Fusce.diam@Donec.com'"
    )
    .required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .message({
      "string.pattern.base":
        "The phone number must be of this type (111) 222-3333",
    })
    .required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z ]+$/)
    .message({ "string.pattern.base": "The name must contain only letters" })
    .min(2)
    .max(30),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .message(
      "Email must contain @ and end with .com or .net. Example: 'dui.Fusce.diam@Donec.com'"
    ),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .message({
      "string.pattern.base":
        "The phone number must be of this type (111) 222-3333",
    }),
});
module.exports = { createContactSchema, updateContactSchema };
