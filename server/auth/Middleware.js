const jwt = require('jsonwebtoken');

const authMiddleware = (requireRole = null) => {

  return async (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Access denied, No token provided' });
  }
  token = token.split(" ")[1]
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    else {
      console.log(decoded);
      req.user = decoded;
      if (requireRole && decoded.role !== requireRole) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }
      next();
    }
  });
};
};
module.exports = authMiddleware;