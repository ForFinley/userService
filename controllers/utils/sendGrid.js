const rp = require('request-promise');

const SG_URL = 'https://api.sendgrid.com/v3/mail/send';
const { SG_API_KEY } = process.env;

exports.sendEmailVerification = async (email, emailHash) => {
  try {
    const url = 'http://localhost:3000/verify/' + emailHash;

    const requestParams = {
      method: 'POST',
      uri: SG_URL,
      headers: {
        Authorization: `Bearer ${SG_API_KEY}`
      },
      body: {
        personalizations: [
          {
            to: [{ email, name: email }],
            subject: 'Email verification'
          }
        ],
        content: [
          {
            type: 'text/plain',
            value: `Click link to verify email address.\n ${url}`
          }
        ],
        from: { email: 'ryanwfeltkamp@gmail.com', name: 'Verify Email' },
        reply_to: { email: 'ryanwfeltkamp@gmail.com', name: 'No Reply' }
      },
      json: true
    };
    return await rp(requestParams);
  } catch (e) {
    console.log('ERROR :: sendEmailVerification ::', e);
  }
};

// exports.sendPasswordReset = async (email, hash) => {
//   try {
//     const url = 'http://localhost:3000/passwordReset/' + hash;
//     const mailOptions = {
//       from: '"Password Reset" <ryqanbb@gmail.com>',
//       to: email,
//       subject: 'Password Reset',
//       html:
//         '<p>Click link to reset your password.</p> <a href=' +
//         url +
//         '>' +
//         url +
//         '</a>'
//     };
//     return await transporter.sendMail(mailOptions);
//   } catch (e) {
//     return false;
//   }
// };

// exports.sendChangeEmail = async (email, hash) => {
//   try {
//     const url = 'http://localhost:3000/changeEmail/' + hash;
//     const mailOptions = {
//       from: '"Change Email" <ryqanbb@gmail.com>',
//       to: email,
//       subject: 'Change Email',
//       // text: 'Hello world?',
//       html:
//         '<p>Click link to change your email.</p> <a href=' +
//         url +
//         '>' +
//         url +
//         '</a>'
//     };
//     return await transporter.sendMail(mailOptions);
//   } catch (e) {
//     return false;
//   }
// };
