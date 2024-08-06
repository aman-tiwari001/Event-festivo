const express = require('express');
const {
  listProperty,
  getUserDetails,
  investInProperty,
  fundAccountWithTestDiam,
  setAccountDataOnChain,
  createTokenAssetOnChain,
  makePayment,
  sendAssetToken
} = require('../controllers/userController');
const userRouter = express.Router();

userRouter
  .post('/list-property', listProperty) 
  .get('/details', getUserDetails)
  .post('/invest/:propId', investInProperty)
  .get('/fund-account', fundAccountWithTestDiam)
  .post('/set-data', setAccountDataOnChain)
  .post('/create-asset', createTokenAssetOnChain)
  .post('/make-payment', makePayment)
  .post('/send-token', sendAssetToken);

module.exports = userRouter;
