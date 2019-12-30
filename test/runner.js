require('dotenv').config();
const {
  checkTables,
  deleteTables,
  createTables,
  createRecords
} = require('./dynamodbLocal');
const { registrationTests } = require('./registration/registration.test');
const { signInTests } = require('./signIn/signIn.test');
const { verifyEmailTests } = require('./verifyEmail/verifyEmail.test');
const { changePasswordTests } = require('./changePassword/changePassword.test');
const {
  passwordResetInitTests
} = require('./passwordReset/passwordResetInit.test');
const {
  passwordResetConfirmTests
} = require('./passwordReset/passwordResetConfirm.test');
const { changeEmailTests } = require('./changeEmail/changeEmail.test');
const { refreshTests } = require('./refresh/refresh.test');
const { signOutTests } = require('./signOut/signOut.test');

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

  describe('Verify Email', () => {
    verifyEmailTests();
  });

  describe('Change Password', () => {
    changePasswordTests();
  });

  describe('Password Reset Init', () => {
    passwordResetInitTests();
  });

  describe('Password Reset Confirm', () => {
    passwordResetConfirmTests();
  });

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
