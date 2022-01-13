// imports
const express = require ('express');
const users = require ('../controllers/users');

// router
exports.router = (function(){
    const routeUsers = express.Router();
    //users routes
    routeUsers.route('/users/singin/').post(users.singin);
    routeUsers.route('/users/login/').post(users.login);
   // routeUsers.route('/users/delete/').delete(users.delete);
   return routeUsers; 
})();