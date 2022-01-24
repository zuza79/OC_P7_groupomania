const { Sequelize, DataTypes } = require('sequelize');

require("dotenv").config()

const sequelize = new Sequelize(`${process.env.DATABASE}`, `${process.env.USER}`, `${process.env.PASSWORD}`, {
    host: 'localhost',
    dialect: 'mysql',
  });

module.exports = sequelize;
/*{
  "development": {
    "username": "USER",
    "password": "PASSWORD",
    "database": "DATABASE",
    "host": "127.0.0.1",
    "dialect": "mysql" 
  },
  "test": {
    "username": "USER",
    "password": "PASSWORD",
    "database": "DATABASE_TEST",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "USER",
    "password": "PASSWORD",
    "database": "DATABASE_PRODUCTION",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
*/

