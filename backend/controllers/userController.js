const DiamSdk = require('diamante-sdk-js');
const axios = require('axios');
const User = require('../models/userModel');
const Property = require('../models/propertyModel');
const server = new DiamSdk.Horizon.Server('https://diamtestnet.diamcircle.io');

const listProperty = async (req, res) => {
  try {
    const {
      title,
      desc,
      total_price,
      images,
      token_name,
      no_of_tokens,
      location
    } = req.body;

    if (
      !title ||
      !desc ||
      !total_price ||
      !images ||
      !token_name ||
      !no_of_tokens ||
      !location
    ) {
      return res
        .status(400)
        .json({ error: 'Please provide all required fields' });
    }

    // Create a token asset using diamante API
    const data = {
      token_name,
      no_of_tokens
    };
    const token = req.headers.authorization;
    const newAssetResp = await fetch(
      'https://diam-estate-server.vercel.app/api/user/create-asset',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(data)
      }
    );

    const owner = req.userId;
    const property = new Property({
      title,
      desc,
      location: JSON.parse(location),
      total_price,
      images,
      owner,
      token_name,
      no_of_tokens,
      available_tokens: no_of_tokens
    });

    if (property.investors.length > 0) {
      const totalPercentageShared = property.investors.reduce(
        (acc, investor) => acc + investor.share_per,
        0
      );
      property.percentageLeft = 100 - totalPercentageShared;
    }
    const savedProperty = await property.save();

    const user = await User.findById(req.userId);
    user.my_listings.push({ property: savedProperty._id });
    await user.save();

    res
      .status(200)
      .json({ result: property, message: 'Property listed successfully' });
  } catch (error) {
    console.error('Error listing new property');
    res.status(500).json({ error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: 'my_investments.property',
        model: 'Property'
      })
      .populate({
        path: 'my_listings.property',
        model: 'Property'
      });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({
      result: user,
      message: 'User details fetched successfully'
    });
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ error: error.message });
  }
};

const investInProperty = async (req, res) => {
  try {
    const { propId } = req.params;
    const { share_per, tokens_left } = req.body;
    const property = await Property.findById(propId).populate('owner');
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if (property.percentageLeft - share_per < 0) {
      return res
        .status(400)
        .json({ error: 'Investment exceeds available percentage.' });
    }

    const user = await User.findById(req.userId);

    const access_token = req.headers.authorization;

    const sendTk = await fetch('https://diam-estate-server.vercel.app/api/user/send-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token
      },
      body: JSON.stringify({
        token_name: property.token_name,
        no_of_tokens:
          (property.no_of_tokens - tokens_left).toString() + '.0000000',
        receiverSecretKey: user.secret_key,
        senderSecretKey: property.owner.distribution_secret_key
      })
    });

    const re = await sendTk.json();

    return res.status(200).json({ data: re });

    property.investors.push({ investor: req.userId, share_per });
    property.percentageLeft -= share_per;
    property.available_tokens = tokens_left;
    await property.save();
    user.my_investments.push({ property: propId, share_per });
    await user.save();

    res.status(200).json({
      result: property,
      message: 'Investment successful'
    });
  } catch (error) {
    console.error('Error investing in property:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const fundAccountWithTestDiam = async (req, res) => {
  try {
    const publicKey = req.public_address;
    console.log(`Received request to fund account ${publicKey}`);
    const response = await axios.get(
      `${process.env.DIAM_FAUCET_URI}?addr=${publicKey}`
    );
    const result = response.data;
    console.log(`Account ${publicKey} activated`, result);
    res.json({ message: `Account ${publicKey} funded successfully` });
  } catch (error) {
    console.error('Error in fund-account:', error);
    res.status(500).json({ error: error.message });
  }
};

const setAccountDataOnChain = async (req, res) => {
  try {
    const { name, value } = req.body;
    const user = await User.findById(req.userId);
    const sourceKeys = DiamSdk.Keypair.fromSecret(user.secret_key);
    const senderPublicKey = sourceKeys.publicKey();
    const account = await server.loadAccount(senderPublicKey);
    const transaction = new DiamSdk.TransactionBuilder(account, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: DiamSdk.Networks.TESTNET
    })
      .addOperation(
        DiamSdk.Operation.manageData({
          name,
          value: value || null
        })
      )
      .setTimeout(30)
      .build();
    transaction.sign(sourceKeys);
    const result = await server.submitTransaction(transaction);
    await server.submitTransaction(transaction);
    // return res.status(200).json({
    //   result,
    //   message: `Data ${name} set to ${value} successfully`
    // });
  } catch (error) {
    console.error('Error setting account data on chain:', error);
    return res.status(500).json({ error: error.message });
  }
};

const createTokenAssetOnChain = async (req, res) => {
  try {
    const { token_name, no_of_tokens } = req.body;
    console.log(
      'Creating token asset on chain:',
      token_name,
      no_of_tokens,
      req.headers.authorization
    );
    const user = await User.findById(req.userId);
    const issuingKeys = DiamSdk.Keypair.fromSecret(user.secret_key);
    // Create a distributor account
    const distributorKeypair = DiamSdk.Keypair.random();
    console.log('dist:', distributorKeypair.publicKey());
    await axios.get(
      `${process.env.DIAM_FAUCET_URI}?addr=${distributorKeypair.publicKey()}`
    );
    user.distribution_address = distributorKeypair.publicKey();
    user.distribution_secret_key = distributorKeypair.secret();
    await user.save();
    const receivingKeys = DiamSdk.Keypair.fromSecret(
      distributorKeypair.secret()
    );
    // Create an asset (token) on diamante chain
    const newAsset = new DiamSdk.Asset(token_name, issuingKeys.publicKey());

    // Create trustline between distributor and issuer account
    server
      .loadAccount(receivingKeys.publicKey())
      .then(function (receiver) {
        let transaction = new DiamSdk.TransactionBuilder(receiver, {
          fee: 100,
          networkPassphrase: DiamSdk.Networks.TESTNET
        })
          .addOperation(
            DiamSdk.Operation.changeTrust({
              asset: newAsset,
              limit: no_of_tokens
            })
          )
          .setTimeout(100)
          .build();
        transaction.sign(receivingKeys);
        return server.submitTransaction(transaction);
      })
      .then(console.log)

      // Send the money (new asset tokens) to the distributor from issuer account
      .then(function () {
        return server.loadAccount(issuingKeys.publicKey());
      })
      .then(function (issuer) {
        let transaction = new DiamSdk.TransactionBuilder(issuer, {
          fee: 100,
          networkPassphrase: DiamSdk.Networks.TESTNET
        })
          .addOperation(
            DiamSdk.Operation.payment({
              destination: receivingKeys.publicKey(),
              asset: newAsset,
              amount: no_of_tokens
            })
          )
          .setTimeout(100)
          .build();
        transaction.sign(issuingKeys);
        return server.submitTransaction(transaction);
      })
      .then(console.log)
      .catch(function (error) {
        console.error(
          'Error occured while tranfering asset to distributor!',
          error
        );
      });

    return res
      .status(200)
      .json({ result: newAsset, message: 'Asset created successfully' });
  } catch (error) {
    console.error('Error creating token asset on chain:');
    return res.status(500).json({ error: error.message });
  }
};

const makePayment = async (req, res) => {
  try {
    const { receiverPublicKey, amount } = req.body;
    const user = await User.findById(req.userId);
    const senderSecret = user.secret_key;
    const senderKeypair = DiamSdk.Keypair.fromSecret(senderSecret);
    const senderPublicKey = senderKeypair.publicKey();
    const account = await server.loadAccount(senderPublicKey);
    const transaction = new DiamSdk.TransactionBuilder(account, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: DiamSdk.Networks.TESTNET
    })
      .addOperation(
        DiamSdk.Operation.payment({
          destination: receiverPublicKey,
          asset: DiamSdk.Asset.native(),
          amount: amount
        })
      )
      .setTimeout(30)
      .build();
    transaction.sign(senderKeypair);
    const result = await server.submitTransaction(transaction);

    res.status(200).json({
      message: `Payment of ${amount} DIAM made to ${receiverPublicKey} successfully`
    });
  } catch (error) {
    console.error('Error in making payment:', error);
    res.status(500).json({ error: error.message });
  }
};

const sendAssetToken = async (req, res) => {
  try {
    console.log('Sending asset token on chain:', req.body);
    const { receiverSecretKey, senderSecretKey, token_name, no_of_tokens } =
      req.body;
    const receiverKeys = DiamSdk.Keypair.fromSecret(receiverSecretKey);
    const senderKeys = DiamSdk.Keypair.fromSecret(senderSecretKey);
    const account = await server.loadAccount(receiverKeys.publicKey());
    const account2 = await server.loadAccount(senderKeys.publicKey());
    const asset = new DiamSdk.Asset(token_name, senderKeys.publicKey());

    // Create trustline between receiver and sender account
    const transaction = new DiamSdk.TransactionBuilder(account, {
      fee: DiamSdk.BASE_FEE,
      networkPassphrase: 'Diamante Testnet'
    })
      .addOperation(DiamSdk.Operation.changeTrust({ asset }))
      .setTimeout(100)
      .build();

    transaction.sign(receiverKeys);
    const result = await server.submitTransaction(transaction);

    // Send the asset tokens to the receiver
    const transaction2 = new DiamSdk.TransactionBuilder(account2, {
      fee: DiamSdk.BASE_FEE,
      networkPassphrase: 'Diamante Testnet'
    })
      .addOperation(
        DiamSdk.Operation.payment({
          destination: receiverKeys.publicKey(),
          asset,
          amount: no_of_tokens
        })
      )
      .setTimeout(100)
      .build();

    transaction2.sign(senderKeys);
    const result2 = await server.submitTransaction(transaction2);
    return res
      .status(200)
      .json({ resut: result, message: 'Asset tokens sent successfully' });
  } catch (error) {
    console.error('Error sending token asset on chain:');
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listProperty,
  getUserDetails,
  makePayment,
  sendAssetToken,
  investInProperty,
  fundAccountWithTestDiam,
  setAccountDataOnChain,
  createTokenAssetOnChain
};
