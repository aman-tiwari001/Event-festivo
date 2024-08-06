const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Attach the necessary data to the request object
    req.userId = decodedToken.userId;
    req.username = decodedToken.username;
    req.public_address = decodedToken.public_address;
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(401).json({ error: error.message });
  }
};
module.exports = authenticateUser;
