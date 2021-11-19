const router = require('express').Router();
const db = require('../models/db');
const auth = require('../middlewares/auth');

// GET
// Get all ingredients
router.route('/').get(auth, (req, res) => {
  db.ingredients.findAll()
    .then((ingredients) => {
      res.status(200).json(ingredients);
    })
    .catch(err => res.status(400).json({error: err}));
});

// Get ingredient by id
router.route('/:id').get(auth, (req, res) => {
  db.ingredients.findByPk(req.params.id)
    .then((ingredient) => {
      res.status(200).json(ingredient);
    })
    .catch(err => res.status(400).json({error: err}));
});


// POST
// Create new ingredient
router.route('/').post(auth, (req, res) => {
  const name = req.body.name;
  const stock = req.body.stock;

  db.ingredients.create({name: name, stock: stock})
    .then((ingredient) => {res.status(200).json({id: ingredient.id})})
    .catch(err => res.status(400).json({error: err}));
});


// PATCH
// Update existing ingredient
router.route('/:id').patch(auth, (req, res) => {

  db.ingredients.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(() => {res.json("Ingredient updated")})
    .catch(err => res.status(400).json({error: err}));
});

module.exports = router;