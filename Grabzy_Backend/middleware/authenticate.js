const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
