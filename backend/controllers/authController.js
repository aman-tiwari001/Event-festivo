const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { Keypair } = require('diamante-base');

const handleUserSignUp = async (req, res) => {
  try {
    const { username } = req.body;
    // Check whether the user is already registered
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exist' });
    }
    // Generate a keypair for the user (public and secret key)
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const secret_key = keypair.secret();
    const public_address = publicKey;

    // Create a new user and save it to the database
    const newUser = new User({
      username,
      public_address,
      secret_key
    });
    await newUser.save();

    // Generate a JWT with payload
    const token = jwt.sign(
      { userId: newUser._id, username, public_address },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1w', issuer: 'EventÓfestivo' }
    );

    // Funding the diamante account with test diam to activat it
    const fundResp = await fetch(
      'http://localhost:4000/api/user/fund-account',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Setting userId on diamante chain for associating web2 credential with web3
    const response = await fetch('http://localhost:4000/api/user/set-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'userId',
        value: newUser._id
      })
    });

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
    // Requires username and secret key for authentication
    const { username, secret_key } = req.body;

    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "User doesn't exist" });
    }

    // Compare the secret key
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
