const router = require('express').Router();
const db = require('../models/db');
const auth = require('../middlewares/auth');

// GET
// Get all recipes
router.route('/').get(auth, (req, res) => {
  db.recipes.findAll()
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch(err => res.status(400).json({error: err}));
});

// Get all recipe name
router.route('/names').get(auth, (req, res) => {
  db.recipes.findAll({attributes : ['name']})
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch(err => res.status(400).json({error: err}));
});

// Get recipe by ID
router.route('/:id').get(auth, (req, res) => {
  db.recipes.findByPk(req.params.id)
    .then((recipe) => {
      db.recipeIngredients.findAll({
        where: {
          id: req.params.id,
        },
        raw : true,
      }).then(async (resIng)=> {
        for (const [i,e] of resIng.entries()) {
          const namaIngredients = await db.ingredients.findByPk(e.ingredient,{
            attributes: ['name'],
            include: [],
            raw: true,
          });
          const completeData = { ...e, ...namaIngredients};
          resIng[i] = completeData;
        }
        res.status(200).json({recipe:recipe, ingredients:resIng});
      })
      .catch(err => res.status(400).json({error: err}))
    })
    .catch(err => res.status(400).json({error: err}));
});


// POST
// Create new recipe.
router.route('/').post(auth, async (req, res) => {
  const name = req.body.name;
  const ingBody = req.body.ingredients;

  const ingredients = await db.ingredients.findAll({attributes: ['id', 'name']});
  ingMap = Object.fromEntries(ingredients.map(e => [e.name, e.id]));

  ingBody.forEach(element => {
    if (!ingMap[element.ingredient]) {
      res.status(400).json({error: "Ingredient does not exist"});
    }
  });

  db.recipes.create({name: name})
    .then((recipe) => {
      const recipeIng = req.body.ingredients.map((ing) => {
        return {id: recipe.id, ingredient: ingMap[ing.ingredient], count: ing.count}
      });

      db.recipeIngredients.bulkCreate(recipeIng)
        .then(() => res.status(200).json({id: recipe.id}))
        .catch(err => {() => res.status(400).json({error: err})})
    })
    .catch(err => res.status(400).json({error: err}));    
});

module.exports = router;