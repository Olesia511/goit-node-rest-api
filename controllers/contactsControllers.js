const { Contact } = require("../models/Contact.js");
const HttpError = require("../helpers/HttpError.js");
const controllersWrapper = require("../helpers/controllersWrapper.js");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;

  const skip = (page - 1) * limit;
  const filters = favorite ? { owner, favorite } : { owner };

  const allContacts = await Contact.find(filters, "-createdAt -updatedAt", {
    skip,
    limit,
  })
    .populate("owner", "email")
    .sort("favorite");

  res.json(allContacts);
};

const getContactById = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;

  const searchContact = await Contact.findOne({ _id, owner });
  if (!searchContact) throw HttpError(404);

  res.json(searchContact);
};

const deleteContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;

  const deleteContact = await Contact.findOneAndDelete({ _id, owner });
  if (!deleteContact) throw HttpError(404);

  res.json(deleteContact);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;

  const addedContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(addedContact);
};

const updateContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;

  const updateResult = await Contact.findOneAndUpdate({ _id, owner }, req.body);
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
