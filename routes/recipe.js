const router = require('express').Router();
const db = require('../models/db');

// GET
// Get all recipes
router.route('/').get((req, res) => {
  db.recipes.findAll()
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch(err => res.status(400).json({error: err}));
});

// Get all recipe name
router.route('/names').get((req, res) => {
  db.recipes.findAll({attributes : ['name']})
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch(err => res.status(400).json({error: err}));
});

// POST
// Create new recipe without ingredient.
router.route('/').post((req, res) => {
  const name = req.body.name;

  db.recipes.create({name: name})
    .then((recipe) => {res.status(200).json({id: recipe.id})})
    .catch(err => res.status(400).json({error: err}));
});

module.exports = router;