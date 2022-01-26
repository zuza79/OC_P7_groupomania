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
     /* models.post.hasMany(comment, {
        foreignKey: 'post_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
    */
    }
  };
  Comment.init({
    
    user_id: DataTypes.SMALLINT,
    post_id: DataTypes.SMALLINT,
    moderate: DataTypes.BOOLEAN,
    content: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};