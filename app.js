const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const contactsRouter = require("./routes/contactsRouter");
const usersRouter = require("./routes/usersRouter");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(logger("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", usersRouter);

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
