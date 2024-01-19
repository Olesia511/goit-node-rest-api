const contactsService = require("../services/contactsServices.js");
const HttpError = require("../helpers/HttpError.js");

const getAllContacts = async (req, res, next) => {
  try {
    const allContacts = await contactsService.listContacts();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const searchContact = await contactsService.getContactById(id);
    if (!searchContact) throw HttpError(404);

    res.json(searchContact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteContact = await contactsService.removeContact(id);
    if (!deleteContact) throw HttpError(404);

    res.json(deleteContact);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const addedContact = await contactsService.addContact(req.body);

    res.status(201).json(addedContact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const keysArr = ["name", "email", "phone"];
    const { id } = req.params;

    const { length } = Object.keys(req.body);
    const invalidKey = Object.keys(req.body).some(
      (key) => !keysArr.includes(key)
    );

    if (length < 1) {
      throw HttpError(400, "Body must have at least one field");
    }

    if (invalidKey) {
      throw HttpError(
        400,
        "Body must have only 'name', 'email' or 'phone' fields"
      );
    }

    const contact = await contactsService.updateContact(id, req.body);
    if (!contact) throw HttpError(404);

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
};
