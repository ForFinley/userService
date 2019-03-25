const nodemailer = require('nodemailer');

const host = 'smtp.gmail.com';
const port = 465;
const secure = true;
const auth = {
  user: 'ryqanbb@gmail.com',
  pass: 'Ilovebeyblades!'
};

exports.sendEmailVerification = async (email, emailHash) => {
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth
    });

    const url = 'http://localhost:3000/verify/' + emailHash;
    const mailOptions = {
      from: '"Verify Email" <ryqanbb@gmail.com>',
      to: email,
      subject: 'Email verification',
      // text: 'Hello world?',
      html:
        '<p>Click link to verify email address.</p> <a href=' +
        url +
        '>' +
        url +
        '</a>'
    };
    return await transporter.sendMail(mailOptions);
  } catch (e) {
    return false;
  }
};

exports.sendPasswordReset = async (email, hash) => {
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth
    });

    const url = 'http://localhost:3000/passwordReset/' + hash;
    const mailOptions = {
      from: '"Password Reset" <ryqanbb@gmail.com>',
      to: email,
      subject: 'Password Reset',
      html:
        '<p>Click link to reset your password.</p> <a href=' +
        url +
        '>' +
        url +
        '</a>'
    };
    return await transporter.sendMail(mailOptions);
  } catch (e) {
    return false;
  }
};

exports.sendChangeEmail = async (email, hash) => {
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth
    });

    const url = 'http://localhost:3000/changeEmail/' + hash;
    const mailOptions = {
      from: '"Change Email" <ryqanbb@gmail.com>',
      to: email,
      subject: 'Change Email',
      // text: 'Hello world?',
      html:
        '<p>Click link to change your email.</p> <a href=' +
        url +
        '>' +
        url +
        '</a>'
    };
    return await transporter.sendMail(mailOptions);
  } catch (e) {
    return false;
  }
};
