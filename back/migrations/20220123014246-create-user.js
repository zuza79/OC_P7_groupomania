'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false

      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique : true
      },
      password: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.INTEGER,
        defaultValue: 1   // 1 = user; 0 = administrateur
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
    await queryInterface.dropTable('Users');
  }
};