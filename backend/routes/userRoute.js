const express = require('express');
const {
  getUserDetails,
  fundAccountWithTestDiam,
  setAccountDataOnChain,
  createTokenAssetOnChain,
  makePayment,
  sendAssetToken,
  listEvent,
  purchaseEventTicket
} = require('../controllers/userController');
const userRouter = express.Router();

userRouter
  .post('/list/event', listEvent) 
  .get('/details', getUserDetails)
  .post('/purchase/ticket/:eventId', purchaseEventTicket)
  .get('/fund-account', fundAccountWithTestDiam)
  .post('/set-data', setAccountDataOnChain)
  .post('/create-asset', createTokenAssetOnChain)
  .post('/make-payment', makePayment)
  .post('/send-token', sendAssetToken);

module.exports = userRouter;
