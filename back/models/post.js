'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Post.belongsTo(models.User, {
        foreignKey: 'userId',
        allowNull: false
      })
      models.Post.belongsTo(models.Comment, {
        foreignKey: 'userId',
        allowNull: false
      })

    }
  };
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    like: DataTypes.INTEGER,
    dislike: DataTypes.INTEGER,
    administration: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};