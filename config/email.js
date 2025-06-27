const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILID,
    pass: process.env.PASSWORD,
  },
});

module.exports = {
  transporter,
};
