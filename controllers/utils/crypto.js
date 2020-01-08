const crypto = require('crypto');

const {
  ENCRYPT_KEY,
  ENCRYPT_PASSWORD_KEY,
  CIPHER_ALGORITHM,
  INPUT_ENCODING,
  OUTPUT_ENCODING,
} = process.env;

exports.encrypt = (text, password) => {
  let encryptKey = ENCRYPT_KEY;
  if (password) encryptKey = ENCRYPT_PASSWORD_KEY;

  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, encryptKey, iv);
  let crypted = cipher.update(text, INPUT_ENCODING, OUTPUT_ENCODING);
  crypted += cipher.final(OUTPUT_ENCODING);
  return `${iv.toString(OUTPUT_ENCODING)}:${crypted.toString()}`;
};

exports.checkPassword = (password, encryptedDBPassword) => {
  try {
    const encryptedDBPasswordSplit = encryptedDBPassword.split(':');
    const iv = Buffer.from(encryptedDBPasswordSplit[0], OUTPUT_ENCODING);
    const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, ENCRYPT_PASSWORD_KEY, iv);

    let crypted = cipher.update(password, INPUT_ENCODING, OUTPUT_ENCODING);
    crypted += cipher.final(OUTPUT_ENCODING);
    const encryptPassword = `${iv.toString(OUTPUT_ENCODING)}:${crypted.toString()}`;

    if (encryptPassword === encryptedDBPassword) return true;
    return false;
  } catch (e) {
    return false;
  }
};

exports.decrypt = (text, password) => {
  try {
    let encryptKey = ENCRYPT_KEY;
    if (password) encryptKey = ENCRYPT_PASSWORD_KEY;

    const textArr = text.split(':');

    const iv = Buffer.from(textArr[0], OUTPUT_ENCODING);
    const encryptedpassword = Buffer.from(textArr[1], OUTPUT_ENCODING);

    const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, encryptKey, iv);
    let decrypted = decipher.update(encryptedpassword, OUTPUT_ENCODING, INPUT_ENCODING);
    decrypted += decipher.final(INPUT_ENCODING);
    return decrypted.toString();
  } catch (e) {
    return false;
  }
};
