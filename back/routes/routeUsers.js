// imports
const express = require ('express');
const users = require ('../controllers/users');

// router
exports.router = (function(){
    const routeUsers = express.Router();
    //users routes
    routeUsers.route('/users/singin/').post(users.singin);
    routeUsers.route('/users/login/').post(users.login);
    routeUsers.route('/users/display/').get(users.displayUser);
    routeUsers.route('/users/modify/').put(users.modifyUser);
    routeUsers.route('/users/delete/').delete(users.deleteUser);
   return routeUsers; 
})();