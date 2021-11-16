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
// Create new recipe.
router.route('/').post((req, res) => {
  const name = req.body.name;

  db.ingredients.findAll({attributes: ['id', 'name']})
    .then((ingredients) => {
      ingMap = Object.fromEntries(ingredients.map(e => [e.name, e.id]));
      db.recipes.create({name: name})
        .then((recipe) => {
          const recipeIng = req.body.ingredients.map((ing) => {
            return {id: recipe.id, ingredient: ingMap[ing.ingredient], count: ing.count}
          });
 
          db.recipeIngredients.bulkCreate(recipeIng)
            .then(() => res.status(200).json({id: recipe.id}))
            .catch(err => {
              db.recipes.destroy({
                where: {
                  id: recipe.id
                }
              })
                .then(() => res.status(400).json({error: err}));
            })
        })
        .catch(err => res.status(400).json({error: err}));
    })
    .catch(err => res.status(400).json({error: err}))
    
});

module.exports = router;