const crypto = require('crypto');
const { encryptKey, encryptPasswordKey } = require('./keys/privateKey.js');
const { ValidationError } = require('./errors.js');

exports.encryptPassword = password => {
  const cipher = crypto.createCipher('aes-256-ecb', encryptPasswordKey);
  const salt = crypto.randomBytes(3).toString('hex');
  const encryptPassword =
    cipher.update(password + salt, 'utf8', 'hex') + cipher.final('hex');
  return {
    encryptPass: encryptPassword,
    salt: salt
  };
};

exports.checkPassword = (password, encryptedDBPassword, salt) => {
  try {
    const cipher = crypto.createCipher('aes-256-ecb', encryptPasswordKey);
    const encryptPassword =
      cipher.update(password + salt, 'utf8', 'hex') + cipher.final('hex');

    if (encryptPassword === encryptedDBPassword) return true;
    return false;
  } catch (e) {
    return false;
  }
};

exports.hashEncrypt = hash => {
  const cipher = crypto.createCipher('aes-256-ecb', encryptKey);
  return cipher.update(hash, 'utf8', 'hex') + cipher.final('hex');
};

//This can also be used to decrypt password
exports.hashDecrypt = hash => {
  try {
    const cipher = crypto.createDecipher('aes-256-ecb', encryptKey);
    return cipher.update(hash, 'hex', 'utf8') + cipher.final('utf8');
  } catch (e) {
    throw new ValidationError('hash invalid');
  }
};
