const { Contact } = require("../models/Contact.js");
const HttpError = require("../helpers/HttpError.js");
const controllersWrapper = require("../helpers/controllersWrapper.js");

const getAllContacts = async (req, res) => {
  const allContacts = await Contact.find();

  res.json(allContacts);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const searchContact = await Contact.findById(id);
  if (!searchContact) throw HttpError(404);

  res.json(searchContact);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deleteContact = await Contact.findByIdAndDelete(id);
  if (!deleteContact) throw HttpError(404);

  res.json(deleteContact);
};

const createContact = async (req, res) => {
  const addedContact = await Contact.create(req.body);
  res.status(201).json(addedContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  console.log(`first id`, id);
  const updateResult = await Contact.findByIdAndUpdate(id, req.body);
  console.log(`after updateContact`);
  if (!updateResult) throw HttpError(404);
  res.json(updateResult);
};

module.exports = {
  getAllContacts: controllersWrapper(getAllContacts),
  getContactById: controllersWrapper(getContactById),
  deleteContact: controllersWrapper(deleteContact),
  createContact: controllersWrapper(createContact),
  updateContact: controllersWrapper(updateContact),
};
