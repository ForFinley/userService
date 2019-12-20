require('dotenv').config();
const {
  checkTables,
  deleteTables,
  createTables,
  createRecords
} = require('./dynamodbLocal');
const { registrationTests } = require('./registration/registration.test.js');
const { signInTests } = require('./signIn/signIn.test.js');
const { verifyEmailTests } = require('./verifyEmail/verifyEmail.test.js');
const {
  changePasswordTests
} = require('./changePassword/changePassword.test.js');
const { passwordResetTests } = require('./passwordReset/passwordReset.test.js');
const { changeEmailTests } = require('./changeEmail/changeEmail.test.js');
const { refreshTests } = require('./refresh/refresh.test.js');
const { signOutTests } = require('./signOut/signOut.test.js');

const sinon = require('sinon');
const nodemailer = require('nodemailer/lib/mailer');
let sandbox = sinon.createSandbox();
sandbox.stub(nodemailer.prototype, 'sendMail').returns(true);

describe('** All End To End Tests **', () => {
  before(async () => {
    const tables = await checkTables();
    await deleteTables(tables);
    await createTables();
    await createRecords();
  });

  describe('Registration', () => {
    registrationTests();
  });

  describe('Sign In', () => {
    signInTests();
  });

  // describe('Verify Email', () => {
  //   verifyEmailTests();
  // });

  describe('Change Password', () => {
    changePasswordTests();
  });

  // describe('Password Reset', () => {
  //   passwordResetTests(sandbox, nodemailer);
  // });

  // describe('Change Email', () => {
  //   changeEmailTests();
  // });

  describe('Refresh', () => {
    refreshTests();
  });

  describe('Sign Out', () => {
    signOutTests();
  });
});
