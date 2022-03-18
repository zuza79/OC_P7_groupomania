'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Likes', {
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
      
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      /*  references: {
          model: 'Users',
          key: 'id'
        },*/
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
    await queryInterface.dropTable('Likes');
  }
};