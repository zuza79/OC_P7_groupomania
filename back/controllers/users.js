// routes - usersCtrl.js
//

// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
}
}

//delete
exports.deleteUser = (req, res, next) => {
    const id = req.params.id;
    Users.delete({
      where: { user_id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({ message: "User delete!"
          });
        } else {
          res.send({
            message: `Impossible delete id=${id}. `
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Users with id=" + id
        });
      });
  };
  
