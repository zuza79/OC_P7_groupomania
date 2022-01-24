const express = require("express");
const bodyParser = require('body-parser');  

const path = require("path");
const helmet = require("helmet");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

////SEQUELIZE
const { Sequelize, DataTypes } = require('sequelize');
require("dotenv").config()    
const sequelize = new Sequelize(`${process.env.DATABASE}`, `${process.env.USER}`, `${process.env.PASSWORD}`, {
  host: 'localhost',
  dialect: 'mysql',
});
module.exports = sequelize;

const connect = async function () {
  try {
    await sequelize.authenticate();
    console.log('SQL en écoute');
  } catch (error) {
    console.error('echeque de connection', error);
  }
};
connect();

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

//transform JSON 
app.use(bodyParser.json()) 
 
app.use(express.json()); 

app.use("/images", express.static(path.join(__dirname, 'images')));
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;
