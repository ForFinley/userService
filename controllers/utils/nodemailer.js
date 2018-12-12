const nodemailer = require("nodemailer");

function sendEmailVerification(email, emailHash) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "ryqanbb@gmail.com",
      pass: "Ilovebeyblades!"
    }
  });

  // let url = "http://localhost:4000/verify/"+emailHash;
  let url = "http://localhost:3000/verify/" + emailHash;
  let mailOptions = {
    from: '"Verify Email" <ryqanbb@gmail.com>',
    to: email,
    subject: "Email verification",
    // text: 'Hello world?',
    html:
      "<p>Click link to verify email address.</p> <a href=" +
      url +
      ">" +
      url +
      "</a>"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}

function passwordReset(email, hash) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "ryqanbb@gmail.com",
      pass: "Ilovebeyblades!"
    }
  });

  let url = "http://localhost:3000/passwordReset/" + hash;
  let mailOptions = {
    from: '"Password Reset" <ryqanbb@gmail.com>',
    to: email,
    subject: "Password Reset",
    // text: 'Hello world?',
    html:
      "<p>Click link to reset your password.</p> <a href=" +
      url +
      ">" +
      url +
      "</a>"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}


function changeEmail(email, hash) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "ryqanbb@gmail.com",
      pass: "Ilovebeyblades!"
    }
  });

  let url = "http://localhost:3000/passwordReset/" + hash;
  let mailOptions = {
    from: '"Change Email" <ryqanbb@gmail.com>',
    to: email,
    subject: "Change Email",
    // text: 'Hello world?',
    html:
      "<p>Click link to change your email.</p> <a href=" +
      url +
      ">" +
      url +
      "</a>"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}

module.exports = {
  sendEmailVerification,
  passwordReset,
  changeEmail
};
