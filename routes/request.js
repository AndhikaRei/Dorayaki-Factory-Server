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
router.route('/').post(async (req, res) => {
  const name = req.body.name;
  const amount = req.body.amount;
  const ip = req.body.ip;

  const recipe = await db.recipes.findOne({ where: { name: name } });
  if (recipe === null) {
    res.status(400).json({error: "Dorayaki recipe not found"});
    return;
  }
  db.requests.create({ip: ip, dorayaki: name, count: amount})
    .then((request) => {res.status(200).json({id: request.id})})
    .catch(err => res.status(400).json({error: err}));
  // TODO : Notify email.
  // TODO : When failed to create make sure not notify email and return
});

// PATCH
// Update existing request
router.route('/:id').patch(auth, async (req, res) => {

  db.requests.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(() => {res.json("Request updated")})
    .catch(err => res.status(400).json({error: err}));
});

// Custom route
// Decline a request
router.route('/:id/decline').post(auth, async (req, res) => {
  const request = await db.requests.findByPk(req.params.id, { 
    raw: true 
  });
  if (request.status != 'pending') {
    res.status(400).json({error: "Only pending stock can be declined"});
    return;
  }
  db.requests.update({status: "declined"}, {
    where: {
      id: req.params.id
    }
  })
  .then(() => {res.json("Request updated")})
  .catch(err => res.status(400).json({error: err}));
});

// Accept a request
router.route('/:id/accept').post(auth, async (req, res) => {
  const request = await db.requests.findByPk(req.params.id, { 
    raw: true 
  });
  if (request.status != 'pending') {
    res.status(400).json({error: "Only pending stock can be accepted"});
    return;
  }
  const recipe = await db.recipes.findOne({
    where: {
      name: request.dorayaki 
    },
    raw: true 
  });
  const indgredientNeeded = await db.recipeIngredients.findAll({
    where: {
      id: recipe.id,
    },
    raw : true,
  });
  const newIngredient = []
  for (const e of indgredientNeeded) {
    const ingredients = await db.ingredients.findByPk(e.ingredient,{
      raw: true
    });
    if (ingredients.stock < e.count * request.count) {
      res.status(400).json({error: "Stock is not enough"});
      return;
    }
    newIngredient.push({id: e.ingredient, stock: ingredients.stock - e.count * request.count});
  };
  for (const ingredient of newIngredient) {
    await db.ingredients.update({stock: ingredient.stock}, {
      where: {
        id: ingredient.id,
      }
    });
  };
  db.requests.update({status: "accepted"}, {
    where: {
      id: req.params.id
    }
  })
    .then(() => {res.json("Request updated")})
    .catch(err => res.status(400).json({error: err}));
});

module.exports = router;