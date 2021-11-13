const Sequelize = require('sequelize');

require('dotenv').config();

const {MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD} = process.env;

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

});

const db = {};

db.sequelize = sequelize;

db.recipes = require("./recipe.model.js")(sequelize, Sequelize.DataTypes);
db.recipeIngredients = require("./recipe_ingredient.model.js")(sequelize, Sequelize.DataTypes);
db.ingredients = require("./ingredient.model.js")(sequelize, Sequelize.DataTypes);
db.requests = require("./request.model.js")(sequelize, Sequelize.DataTypes);
db.requestLogs = require("./request_log.model.js")(sequelize, Sequelize.DataTypes);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = db;