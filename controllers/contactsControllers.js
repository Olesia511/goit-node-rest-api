const contactsService = require("../services/contactsServices.js");
const HttpError = require("../helpers/HttpError.js");
const controllersWrapper = require("../helpers/controllersWrapper.js");

const getAllContacts = async (req, res, next) => {
  const allContacts = await contactsService.listContacts();
  res.json(allContacts);
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;
  const searchContact = await contactsService.getContactById(id);
  if (!searchContact) throw HttpError(404);

  res.json(searchContact);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const deleteContact = await contactsService.removeContact(id);
  if (!deleteContact) throw HttpError(404);

  res.json(deleteContact);
};

const createContact = async (req, res, next) => {
  const addedContact = await contactsService.addContact(req.body);
  res.status(201).json(addedContact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;

  const contact = await contactsService.updateContact(id, req.body);
  if (!contact) throw HttpError(404);
  res.json(contact);
};

module.exports = {
  getAllContacts: controllersWrapper(getAllContacts),
  getContactById: controllersWrapper(getContactById),
  deleteContact: controllersWrapper(deleteContact),
  createContact: controllersWrapper(createContact),
  updateContact: controllersWrapper(updateContact),
};
