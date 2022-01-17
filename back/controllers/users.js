// routes - usersCtrl.js
// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtAuth = require ('../middleware/auth')
const models = require ('../models');

// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

//singin
module.exports = {
    singin: function (req, res) {
        //parametre
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        
        if (email == null || username == null || password == null){
            return res.status (400).json({'error': 'missing parameters'});
        }
        if (username.length >= 13 || username.length <= 4) {
            return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
          }
      
          if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email is not valid' });
          }
      
          if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
          }
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
        .then(function(userFound){
            if (!userFound){
                bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                    const newUser = models.User.create ({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        admin: 0 
                    })
                    .then(function(newUser){
                        return res.status(201).json ({
                            'userId': newUser.id
                        })
                    })
        .catch(function (err){
                return res.status(500).json({'error':'cannot add user'});
                    });
                });

            } else {
                return res.status (409).json ({'error': 'user already exist'});
            }
        })
        .catch (function (err){
            return res.status(500).json({ 'error': 'unable to verify user'});
        });

    },
   
/////login
login: function (req, res){
    //params
    const email = req.body.email;
    const password = req.body.password;

    if(email == null || password == null){
        return res.status(400).json ({'error': 'missing parameters'});
    }

    models.User.findOne({
        where: { email: email }
    })
    .then(function(userFound) {
        console.log(userFound.id);
        if(userFound){
        bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
            if(resBycrypt) {
                return res.status(200).json({
                    'userId':userFound.id,
                    'token': jwt.sign(
                        {userId: userFound.id, admin: userFound.admin},
                        'lskfj354fdlkgrin26ffchilk13g4g6d',
                        {expiresIn: '24h'})

                });
        } else {
                return res.status(403).json({'error': 'invalid password'});    
            }
        });
        } else {
            return res.status(404).json({'error': 'user not exist in DB'});    
        }
    })
    .catch(function(err) {
        return res.status(500).json({'error': 'unable to verify user'});
    });
  },

  //display user
  displayUser: function(req, res) {
    // Getting auth header
    const headerAuth  = req.headers['authorization'];
    const userId      = jwtAuth.getUserId(headerAuth);

    if (userId < 0)
      return res.status(400).json({ 'error': 'wrong token' });

    models.User.findOne({
      attributes: [ 'id', 'email', 'username'],
      where: { id: userId }
    }).then(function(user) {
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    }).catch(function(err) {
      res.status(500).json({ 'error': 'cannot fetch user' });
    });
  },

///////modify user
  modifyUser: function(req, res) {
    // Getting auth header
    const headerAuth  = req.headers['authorization'];
    const userId      = jwtAuth.getUserId(headerAuth);

    // Params
    const username = req.body.username;
      models.User.findOne({
          attributes: ['id', 'username'],
          where: { id: userId }
        }).then(function(userFound) {
          if (userFound) {
            res.status(201).json(userFound);
          } else {
            res.status(404).json({ 'error': 'user not found' });
          }
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot fetch user' });
        });
      },
      function(userFound) {
        if(userFound) {
          userFound.update({
            username: (username ? username : userFound.username)
          }).then(function(userFound) {
            if (userFound) {
              res.status(201).json(userFound);
            }
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user' });
          });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    
    //// delete user
deleteUser: function (req, res) {
  // Getting auth header
  const headerAuth  = req.headers['authorization'];
  const userId      = jwtAuth.getUserId(headerAuth);
  
  const deleteUser = req.body.id;
  models.User.findOne ({
    attributes: [ 'id', 'email', 'password'],
    where: { id: userId }
  }).then(function(user) {
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).json({ 'error': 'user not found' });
    }
  }).catch(function(err) {
    res.status(500).json({ 'error': 'cannot fetch user' });
  });
  
  }
  /*/exports.deleteUser = (req, res, next) => {
    const id = req.body.id;
    Users.delete({
      where: { user_id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Utilisateur supprimé!"
          });
        } else {
          res.send({
            message: `Impossible de supprimer id=${id}. `
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Users with id=" + id
        });
      });
  };/*/
  
  };

