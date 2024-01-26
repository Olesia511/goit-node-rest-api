const express = require("express");
const {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
} = require("../controllers/contactsControllers.js");
const validateBody = require("../helpers/validateBody.js");
const {
  // createContactSchema,
  // updateContactSchema,
  favoriteContactSchema,
} = require("../models/Contact.js");

const isIdValid = require("../helpers/validateId.js");

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isIdValid, getContactById);

contactsRouter.delete("/:id", isIdValid, deleteContact);

contactsRouter.post("/", createContact);
// contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", isIdValid, updateContact);

// contactsRouter.put("/:id", isIdValid, validateBody(updateContactSchema), updateContact);

contactsRouter.patch(
  "/:id/favorite",
  isIdValid,
  validateBody(favoriteContactSchema),
  updateContact
);

module.exports = contactsRouter;
