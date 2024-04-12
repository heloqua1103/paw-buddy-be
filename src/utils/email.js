const nodemailer = require("nodemailer");

const sendMail = async ({ email, html, content }) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_NAME, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `
    ${content} <no-relply@gmail.com>`, // sender address
    to: email, // list of receivers
    subject: "New Password", // Subject line
    html: html, // html body
  });

  return info;
};

module.exports = sendMail;
