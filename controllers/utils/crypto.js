const crypto = require('crypto');
const encryptKey = '!cipher&%#$';
const { ValidationError } = require('./errors.js');

function encryptPassword(password) {
  const cipher = crypto.createCipher('aes-256-ecb', encryptKey);
  const salt = crypto.randomBytes(3).toString('hex');
  const encryptPassword =
    cipher.update(password + salt, 'utf8', 'hex') + cipher.final('hex');
  const result = {
    encryptPass: encryptPassword,
    salt: salt
  };
  return result;
}

function checkPassword(password, encryptedDBPassword, salt) {
  try {
    const cipher = crypto.createCipher('aes-256-ecb', encryptKey);
    const encryptPassword =
      cipher.update(password + salt, 'utf8', 'hex') + cipher.final('hex');

    if (encryptPassword === encryptedDBPassword) return true;
    return false;
  } catch (e) {
    return false;
  }
}

function hashEncrypt(hash) {
  const cipher = crypto.createCipher('aes-256-ecb', encryptKey);
  return cipher.update(hash, 'utf8', 'hex') + cipher.final('hex');
}

//This can also be used to decrypt password
function hashDecrypt(hash) {
  try {
    const cipher = crypto.createDecipher('aes-256-ecb', encryptKey);
    return cipher.update(hash, 'hex', 'utf8') + cipher.final('utf8');
  } catch (e) {
    throw new ValidationError('hash invalid');
  }
}

module.exports = {
  encryptPassword,
  checkPassword,
  hashEncrypt,
  hashDecrypt
};
