const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Register
router.route('/register').post(async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const usernameExist = await db.users.findOne({
    where: {
      username: username,
    }
  });
  if (usernameExist) {
    return res.status(400).json({error: 'Username already exists'});
  }

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  db.users.create({username: username, email: email, password: hash})
    .then((user) => {res.status(200).json({id: user.id})})
    .catch(err => res.status(400).json({error: err}));
});

// Login
router.route('/login').post(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await db.users.findOne({
    where: {
      username: username,
    }
  });
  if (!user) {
    return res.status(400).json({error: 'Wrong username or password'});
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({error: 'Wrong username or password'});
  }

  const token = jwt.sign({id: user.id, username}, process.env.SECRET_KEY);
  res.status(200).json({token: token});
});

module.exports = router;