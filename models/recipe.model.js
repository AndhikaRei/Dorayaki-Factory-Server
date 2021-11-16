const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {}
  Recipe.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'Recipe must have a name' },
          notEmpty: { msg: 'Name must not be empty' },
        },
      },
    },
    {
      sequelize,
      tableName: 'Recipes',
      modelName: 'Recipe',
    }
  )
  return Recipe
}