const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./auth');

function authenticate(role) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      if (role && payload.role !== role) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      req.user = payload;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}

module.exports = authenticate;
