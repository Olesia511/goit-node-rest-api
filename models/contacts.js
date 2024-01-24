const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model.bind(mongoose);

const typeContactShema = {
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
};
const contactShema = new Schema(typeContactShema);
const Contact = model("contact", contactShema);

module.exports = Contact;
