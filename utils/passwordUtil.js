const crypto = require('crypto');
var encryptKey = "!cipher&%#$";

function encryptPassword(password) {
    let cipher = crypto.createCipher('aes-256-ecb', encryptKey);
    let salt = crypto.randomBytes(3).toString('hex');
    let encryptPassword = cipher.update(password + salt,'utf8', 'hex') + cipher.final('hex');
    let result = {
        encryptPass: encryptPassword,
        salt: salt
    }
    return result;
};

function checkPassword(password, encryptedDBPassword, salt){
    let cipher = crypto.createCipher('aes-256-ecb', encryptKey);
    let encryptPassword = cipher.update(password + salt,'utf8', 'hex') + cipher.final('hex');
    
    if(encryptPassword === encryptedDBPassword) return true;
    return false;
}

function decryptPassword(password, salt) {
    var cipher = crypto.createDecipher('aes-256-ecb', encryptKey);
    return cipher.update(password + salt, 'hex', 'utf8') + cipher.final('utf8');
};

module.exports = {
    encryptPassword,
    checkPassword,
    decryptPassword
};
