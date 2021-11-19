const Sequelize = require('sequelize');
const mysql = require('mysql2/promise');

require('dotenv').config();

const {MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD} = process.env;

mysql.createConnection({
  host: MYSQL_HOST || "127.0.0.1",
  port: MYSQL_PORT || "3306",
  user     : MYSQL_USER || "root",
  password : MYSQL_PASSWORD || "root",
}).then( connection => {
  connection.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};`).then((res) => {
      console.info("Database create or successfully checked");

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
      db.users = require("./user.model.js")(sequelize, Sequelize.DataTypes);
      
      sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
          sequelize.sync().then(() => {
            process.exit(0);
          });
        })
        .catch(err => {
          console.error('Unable to connect to the database:', err);
      });
  })
})



