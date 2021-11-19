const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({error: 'User not authenticated'});
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({error: 'Invalid token'})
  }
}