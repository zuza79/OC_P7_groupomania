'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.User, {
          foreignKey:  'userId',
          as: 'user',
                 
      });
      
      models.Comment.belongsTo(models.Post, { 
       foreignKey: 'postId', 
          as: 'post',
      
     });
    }  
    };

  Comment.init({
    
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};