require("dotenv").config();

const { SENDGRID_API_KEY, SENDGRID_MAIL_FROM, BASE_URL } = process.env;

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = (email, verificationToken) => {
  const msg = {
    to: email,
    from: SENDGRID_MAIL_FROM,
    subject: "Verify email",
    text: "Verify email with SENDGRID",
    html: ` <a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">
        Click to verify Email =>
      </a>`,
  };

  return sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
module.exports = sendEmail;
