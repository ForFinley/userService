/* eslint-disable operator-linebreak */
const identityService = require('./routes');
const { authenticate, authRole } = require('./middlewares/authenticate');

module.exports = config => {
  console.log(config);

  // process.env.USER_TABLE = config.user_table || 'users';
  // process.env.REFRESH_TABLE = config.refresh_table || 'refresh';
  // process.env.REGION = config.region || 'us-east-1';
  // process.env.ACCESSS_TOKEN_TIME = config.access_token_time || 72000;
  // process.env.REFRESH_TOKEN_TIME = config.refresh_token_time || 720000;
  // process.env.ACCESS_KEY = config.access_key || 'server_secret';
  // process.env.REFRESH_KEY = config.refresh_key || 'refresh_secret';
  // process.env.GOOGLE_DECRYPT_API = 'https://www.googleapis.com';
  // process.env.CIPHER_ALGORITHM = config.cipher_algorithm || 'aes-256-ctr';
  // process.env.ENCRYPT_PASSWORD_KEY =
  //   config.encrypt_password_key || 'b2df428b9929d3ace7c598bbf4e496b2';
  // process.env.ENCRYPT_KEY = config.encrypt_key || 'ciphersjdkfituejdnvmgjfhnskcjsme';
  // process.env.INPUT_ENCODING = config.input_encoding || 'utf8';
  // process.env.OUTPUT_ENCODING = config.output_encoding || 'hex';
  // process.env.SG_API_KEY =
  //   config.sg_api_key || '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';
  // process.env.SG_URL = 'https://api.sendgrid.com';
  // process.env.EMAIL_FE_HOST = config.email_fe_host || 'http://localhost';
  // process.env.NODE_ENV = config.localDB ? 'LOCAL' : 'PROD';

  return {
    identityService,
    authenticate,
    authRole,
  };
};
