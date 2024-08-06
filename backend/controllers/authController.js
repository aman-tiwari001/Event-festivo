const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { Keypair } = require('diamante-base');
const { Horizon } = require('diamante-sdk-js');
const { default: axios } = require('axios');

const handleUserSignUp = async (req, res) => {
  try {
    const { username, location } = req.body;

    // Check whether the user is already registered
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exist' });
    }

    // make API call to diamante to create a new account
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const secret_key = keypair.secret();
    const public_address = publicKey;
    console.log(keypair.publicKey);

    // Check for valid username
    if (!/^[a-zA-Z0-9_]{3,60}$/.test(username)) {
      return res.status(400).json({ error: 'Invalid username' });
    }

    // Create a new user
    const newUser = new User({
      username,
      public_address,
      secret_key,
      location
    });
    await newUser.save();

    // Generate a JWT token with payload data
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, public_address },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1w', issuer: 'EventÓfestivo' }
    );

    // Setting userId on diamante chain for associating web2 credential with web3
    // const setDataResp = await axios.post('/api/user/set-data', {
    //   name: 'userId',
    //   value: newUser._id
    // });

    // console.log(setDataResp.data);

    res.status(201).json({
      result: newUser,
      access_token: token,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { username, secret_key } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "User doesn't exist" });
    }

    if (user.secret_key !== secret_key) {
      return res.status(401).json({ error: 'Invalid secret key' });
    }

    // Generate a JWT token with payload data
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        public_address: user.public_address
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1w', issuer: 'EventÓfestivo' }
    );

    res
      .status(200)
      .json({ result: user, access_token: token, message: 'User logged in' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleUserLogin, handleUserSignUp };
