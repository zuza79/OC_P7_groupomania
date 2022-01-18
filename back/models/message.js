'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Message.belongsTo(models.User, {
        foreignKey: 'userId',
        allowNull: false
      })
    }
  };
  Message.init({
    idUSERS: DataTypes.INTEGER,
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    image: DataTypes.STRING,
    like: DataTypes.STRING,
    dislike: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};