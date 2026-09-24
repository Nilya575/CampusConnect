const jwt = require('jsonwebtoken');

// Check karo user logged in hai ya nahi
const protect = (req, res, next) => {
  try {
    // Token "Authorization" header se aata hai, format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, access denied' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer" ke baad wala part

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Decoded data (id, role) ko request mein attach kar do, aage use karne ke liye
    req.user = decoded;

    next(); // sab sahi hai, aage jaane do

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check karo user ka role allowed hai ya nahi
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { protect, authorize };