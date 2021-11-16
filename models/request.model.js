const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Request extends Model {}
  Request.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dorayaki: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Dorayaki name must not be empty' },
        },
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: ['accepted', 'pending', 'declined'],
        defaultValue: 'pending',
        allowNull: false,
      },
      recognized : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: '0'
      },
    },
    {
      sequelize,
      tableName: 'Requests',
      modelName: 'Request',
    }
  )
  return Request
}