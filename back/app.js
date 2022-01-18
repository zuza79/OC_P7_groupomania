// Importation d'express et création de l'application
const express = require('express');
const app = express();


// Importation des modules
const mysql = require('mysql')
const path = require('path');


// Importation des routes
const userRoutes = require('./routes/user.js');
//const postRoutes = require('./routes/post.js');


// Middlewares permettant l'analyse du corps de la requête
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Autorise l'accès à l'API et l'envoie de requêtes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// Connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    database: 'groupomania_sql_db',
    user: 'root',
    password: 'Pra123ha*'
})


// Ajoût des routes
app.use('/api/users', userRoutes);
//app.use('/api/posts', postRoutes);


// Gestion des requêtes vers la route '/images'
app.use('/images', express.static(path.join(__dirname, 'images')));


// Ecoute et lie l'application au port 3000
app.listen(3000);
console.log('Server en écoute.');



 module.exports = app;