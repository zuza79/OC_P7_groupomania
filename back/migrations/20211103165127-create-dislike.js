'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Dislikes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
     PostId: {
        allowNull: false,
        type: Sequelize.INTEGER,
       /* references: {
          model: 'Posts',
          key: 'id'
        },*/
        onDelete: 'cascade'
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
       /* references: {
          model: 'Users',
          key: 'id'
        },*/
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Dislikes');
  }
};