const router = require('express').Router();
const db = require('../models/db');
const auth = require('../middlewares/auth');

// GET
// Get all requests
router.route('/').get(auth, (req, res) => {
  db.requests.findAll()
    .then((requests) => {
      res.status(200).json(requests);
    })
    .catch(err => res.status(400).json({error: err}));
});

// Get request by id
router.route('/:id').get(auth, (req, res) => {
    db.requests.findByPk(req.params.id)
      .then((request) => {
        res.status(200).json(request);
      })
      .catch(err => res.status(400).json({error: err}));
});

// POST
// Create new requests
router.route('/').post((req, res) => {
    const name = req.body.name;
    const amount = req.body.amount;
    const ip = req.body.ip;

    // TODO : Dorayaki name must exist in factory, otherwise error.
    db.requests.create({ip: ip, dorayaki: name, count: amount})
      .then((request) => {res.status(200).json({id: request.id})})
      .catch(err => res.status(400).json({error: err}));
    // TODO : Notify email.
    // TODO : When failed to create make sure not notify email and return
});

// PATCH
// Update existing request
router.route('/:id').patch(auth, (req, res) => {

  db.requests.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(() => {res.json("Request updated")})
    .catch(err => res.status(400).json({error: err}));
});

module.exports = router;