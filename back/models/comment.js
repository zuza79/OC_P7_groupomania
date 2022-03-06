'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(
        models.User, {foreignKey:{allowNull: false },
        onDelete: 'CASCADE'
      },
        models.Post, { foreignKey:{allowNull: false},
        onDelete: 'CASCADE'
      })
    
    }
  };
  Comment.init({
    
    userId: DataTypes.SMALLINT,
    postId: DataTypes.SMALLINT,
    content: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};