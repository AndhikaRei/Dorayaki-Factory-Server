const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RecipeIngredient extends Model {}
  RecipeIngredient.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Recipes',
          key: 'id',
        },
      },
      ingredient: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Ingredients',
          key: 'id',
        },
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      tableName: 'Recipe_Ingredients',
      modelName: 'Recipe_Ingredient',
    }
  )
  return RecipeIngredient
}