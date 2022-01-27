const express = require("express");
const bodyParser = require('body-parser');  
const path = require("path");
const sequelize = require('./config/config');

//security
const helmet = require("helmet");
const dotenv = require ('dotenv');
const resul = dotenv.config();

//import routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

/*///connect to SEQUELIZE
const connect = async function () {
  try {
    await sequelize.authenticate();
    console.log('SQL connect');
  } catch (error) {
    console.error('Echeque de connection', error);
  }
};
connect();
*/
const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(bodyParser.json()) 
app.use(express.json()); 

app.use("/images", express.static(path.join(__dirname, 'images')));
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;