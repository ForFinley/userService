const rp = require('request-promise');

const { SG_API_KEY, SG_URL, EMAIL_FE_HOST } = process.env;

exports.sendEmailVerification = async (email, emailHash) => {
  try {
    const url = `${EMAIL_FE_HOST}/verify/${emailHash}`;

    const requestParams = {
      method: 'POST',
      uri: `${SG_URL}/v3/mail/send`,
      headers: {
        Authorization: `Bearer ${SG_API_KEY}`,
      },
      body: {
        personalizations: [
          {
            to: [{ email, name: email }],
            subject: 'Email verification',
          },
        ],
        content: [
          {
            type: 'text/plain',
            value: `Click link to verify email address.\n ${url}`,
          },
        ],
        from: { email: 'ryanwfeltkamp@gmail.com', name: 'Verify Email' },
        reply_to: { email: 'ryanwfeltkamp@gmail.com', name: 'No Reply' },
      },
      json: true,
    };
    return await rp(requestParams);
  } catch (e) {
    console.log(`ERROR :: sendEmailVerification :: for ${email} :: ${e}`);
    return true;
  }
};

exports.sendPasswordReset = async (email, hash) => {
  try {
    const url = `${EMAIL_FE_HOST}/passwordReset/${hash}`;

    const requestParams = {
      method: 'POST',
      uri: `${SG_URL}/v3/mail/send`,
      headers: {
        Authorization: `Bearer ${SG_API_KEY}`,
      },
      body: {
        personalizations: [
          {
            to: [{ email, name: email }],
            subject: 'Reset Password',
          },
        ],
        content: [
          {
            type: 'text/plain',
            value: `Click link to reset your password.\n ${url}`,
          },
        ],
        from: { email: 'ryanwfeltkamp@gmail.com', name: 'Verify Email' },
        reply_to: { email: 'ryanwfeltkamp@gmail.com', name: 'No Reply' },
      },
      json: true,
    };
    return await rp(requestParams);
  } catch (e) {
    console.log(`ERROR :: sendPasswordReset :: for ${email} :: ${e}`);
    return true;
  }
};

exports.sendChangeEmail = async (email, hash) => {
  try {
    const url = `${EMAIL_FE_HOST}/changeEmail/${hash}`;

    const requestParams = {
      method: 'POST',
      uri: `${SG_URL}/v3/mail/send`,
      headers: {
        Authorization: `Bearer ${SG_API_KEY}`,
      },
      body: {
        personalizations: [
          {
            to: [{ email, name: email }],
            subject: 'Change Email',
          },
        ],
        content: [
          {
            type: 'text/plain',
            value: `Click link to change your email.\n ${url}`,
          },
        ],
        from: { email: 'ryanwfeltkamp@gmail.com', name: 'Verify Email' },
        reply_to: { email: 'ryanwfeltkamp@gmail.com', name: 'No Reply' },
      },
      json: true,
    };
    return await rp(requestParams);
  } catch (e) {
    console.log(`ERROR :: sendChangeEmail :: for ${email} :: ${e}`);
    return true;
  }
};
