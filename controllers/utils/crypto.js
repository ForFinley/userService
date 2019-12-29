const crypto = require('crypto');
const { ValidationError } = require('./errors');
const {
  ENCRYPTKEY,
  ENCRYPTPASSWORDKEY,
  ALGORITHM,
  INPUTENCODING,
  OUTPUTENCODING
} = process.env;

exports.encrypt = (text, password) => {
  let encryptKey = ENCRYPTKEY;
  if (password) encryptKey = ENCRYPTPASSWORDKEY;

  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv(ALGORITHM, encryptKey, iv);
  let crypted = cipher.update(text, INPUTENCODING, OUTPUTENCODING);
  crypted += cipher.final(OUTPUTENCODING);
  return `${iv.toString(OUTPUTENCODING)}:${crypted.toString()}`;
};

exports.checkPassword = (password, encryptedDBPassword) => {
  try {
    encryptedDBPasswordSplit = encryptedDBPassword.split(':');
    const iv = Buffer.from(encryptedDBPasswordSplit[0], OUTPUTENCODING);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTPASSWORDKEY, iv);

    let crypted = cipher.update(password, INPUTENCODING, OUTPUTENCODING);
    crypted += cipher.final(OUTPUTENCODING);
    const encryptPassword = `${iv.toString(
      OUTPUTENCODING
    )}:${crypted.toString()}`;

    if (encryptPassword === encryptedDBPassword) return true;
    return false;
  } catch (e) {
    return false;
  }
};

exports.decrypt = (text, password) => {
  try {
    let encryptKey = ENCRYPTKEY;
    if (password) encryptKey = ENCRYPTPASSWORDKEY;

    text = text.split(':');

    const iv = Buffer.from(text[0], OUTPUTENCODING);
    const encryptedpassword = Buffer.from(text[1], OUTPUTENCODING);

    const decipher = crypto.createDecipheriv(ALGORITHM, encryptKey, iv);
    let decrypted = decipher.update(
      encryptedpassword,
      OUTPUTENCODING,
      INPUTENCODING
    );
    decrypted += decipher.final(INPUTENCODING);
    return decrypted.toString();
  } catch (e) {
    return false;
  }
};

//Deprecated
exports.hashEncrypt = hash => {
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTKEY);
  return (
    cipher.update(hash, INPUTENCODING, OUTPUTENCODING) +
    cipher.final(OUTPUTENCODING)
  );
};

exports.hashDecrypt = hash => {
  try {
    const cipher = crypto.createDecipher(ALGORITHM, ENCRYPTKEY);
    return (
      cipher.update(hash, OUTPUTENCODING, INPUTENCODING) +
      cipher.final(INPUTENCODING)
    );
  } catch (e) {
    throw new ValidationError('hash invalid');
  }
};
