// controllers - user
// singup, login, delete, display one/all, modify
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const hash = require('hash.js');
const fs = require('fs')

const models = require('../models')
const User = models.User;

// REGEX
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d).{4,8}$/;

//////// SIGNUP
exports.signup = (req, res, next) => {
    console.log("console log signup backend  " +JSON.stringify(req.body));
       const user= req.body;
  //const user= JSON.parse(req.body.user); 
  const email = user.email;
    const password = user.password;
    const nom = user.nom;
    const prenom = user.prenom;
   
    if(email == null || password == null || nom == null || prenom == null) {
        return res.status(400).json({ 'erreur': 'paramètres manquants' });
    } 
    if (nom.length > 20 || nom.length < 2) {
        return res.status(400).json({ 'erreur': 'prénom invalide (doit être entre 2 et 20 caractères)' })
    } 
    if (prenom.length > 20 || prenom.length < 2) {
        return res.status(400).json({ 'erreur': 'nom invalide (doit être entre 2 et 20 caractères)' })
    } 
    if(!emailRegex.test(email)) {
        return res.status(400).json({ 'erreur': 'email invalide' })
    } 
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 'erreur': 'mot de passe invalide (doit contenir entre 4 et 8 caractères et au moins un chiffre)'})
    }
  
    User.findOne({
        attributes: ['email'],
        where: { email: email }
    })
    .then(user => {
        if(!user) {
            bcrypt.hash(password, 10)
                .then(hash => {
                    const newUser = models.User.create({
                        email: email,
                        password: hash,
                        nom: nom,
                        prenom: prenom,
                       
                       role : 1
                        
                    })
                    .then((newUser) => {
                        return res.status(201).json({ 'userId': newUser.id })
                    })
                    .catch(err => {
                        return res.status(500).json({ err })
                    })
                }).catch(err => {
                    return res.status(500).json({ err })
                })

       } else {
            return res.status(409).json({ 'error': 'user already exist' });
        }
    })
    .catch(err => { console.log("erreur signUp" +err);
        return res.status(500).json({ err });
    })
};

///////// LOGIN
exports.login = (req, res, next) => {
    console.log("console login backend debut"  +JSON.stringify(req.body));
   // const user= req.body.user;
    const email = req.body.email;
    const password = req.body.password;
 
   if(email == null || password == null) {
        return res.status(400).json({ 'erreur': 'paramètres manquants' });
  }
  
    User.findOne({ 
        where: {email: email}
     })
       .then(user => {
        if (!user) {
            return res.status(401).json('Utilisateur non trouvé !');
        } 
        console.log("console user  " +req.body.password);
        console.log("console user  " +user.password);

    bcrypt.compare(password, user.password)
    //console.log('console log  bcrypt user.password: ' + user.password)
    //console.log('console log  bcrypt password: ' + password)
                    .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !'} )
                    }
                    res.status(200).json({
                        userId: user.id,
                        token: jwtUtils.generateTokenForUser(user)
                    })
                   // console.log('console log  token: ' + token)
                     })
                .catch(err => {
                    res.status(500).json({ err })
                });
        })
        .catch(err => { console.log("erreur login  " +err);
        return res.status(500).json({ err });
        });
}



/////////////// DELETE
exports.deleteUser = (req, res, next) => {
    User.findOne({ where: { id: req.params.id }})
    .then(User => {
        if (User.image != null) {
            const filename = User.image.split('/images/profiles/')[1];
            fs.unlink(`images/profiles/${filename}`, () => {
                User.destroy({ where: { id: req.params.id } })

                .then(() => res.status(200).json({message : 'Utilisateur supprimé !'}))
                .catch( error => res.status(400).json({error}));
            })
        } else {
            User.destroy({ where: { id: req.params.id } })

            .then(() => res.status(200).json({message : 'Utilisateur supprimé !'}))
            .catch( error => res.status(400).json({error}));
        }
    })
};
////// DISPLAY ONE USER
   
exports.getOneUser = (req, res, next) => {
    const userId = req.params.id;
    User.findOne({
        attributes: [ 'id', 'email', 'nom', 'prenom', 'image' ],
        where: { id: userId }
    }).then((user) => {
        if(user){
            res.status(200).json(user);
        } else {
            res.status(404).json({ 'erreur': 'Utilisateur non trouvé !'})
        }
    }).catch(err => res.status(500).json({err}))
}


////// DISPLAY ALL USERS

exports.getAllUsers = (req, res, next) => {
    console.log("get all users"  +JSON.stringify(req.body));
    User.findAll()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json(error))
};
////// MODIFY USER AND UPDATE

exports.modifyUser = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
        if (req.file) {

        User.findOne({ where: { id: req.params.id }})
       
           .then(User => {
            if (userId === User.id || role === 0) {
                if (User.image) { 
                const filename = User.image.split('/images/profiles/')[1];
                fs.unlink(`images/profiles/${filename}`, () => {
                    
                    const modifyUser = {
                        nom: req.body.nom,
                        prenom: req.body.prenom,
                        email: req.body.email,
                        image: `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}`
                    };
        
                    user.update(modifyUser , { where: { id: req.params.id } })
                
                        .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
                        .catch( error => res.status(400).json({error}));
                })} else {
                    const modifyUser = {
                        nom: req.body.nom,
                        prenom: req.body.prenom,
                        email: req.body.email,
                        image: `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}`
                    };
            
                    user.update(modifyUser , { where: { id: req.params.id } })
            
                        .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
                        .catch( error => res.status(400).json({error}));
                }
            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch( error => res.status(400).json({error}));

    } else {
        User.findOne({ where: { id: req.params.id }})
        .then(User => {
            if (userId === User.id || role === 0) {
                if (user.image && req.body.image === '') {
                    const filename = user.image.split('/images/profiles/')[1];
                    fs.unlink(`images/profiles/${filename}`, () => {
                        const modifyUser = {
                            nom: req.body.nom,
                            prenom: req.body.prenom,
                            email: req.body.email,
                            image: ''
                        };

                        user.update(modifyUser , { where: { id: req.params.id } })

                            .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
                            .catch( error => res.status(400).json({error}));
                    })
                } else {
                    const modifyUser = {
                        nom: req.body.nom,
                        prenom: req.body.prenom,
                        email: req.body.email,
                    };
            
                    user.update(modifyUser , { where: { id: req.params.id } })
            
                        .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
                        .catch( error => res.status(400).json({error}));
                }
            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch( error => res.status(400).json({error}));
    }
};

//admin modify user
exports.AdminModifyUser = (req, res, next) => {
    
    const modifyUser = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        role: req.body.role
    };

    user.update(modifyUser, { where: { id: req.params.id }
        })
        .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
        .catch((error)=> res.status(400).json({error}));
};

//modify password
exports.modifyPassword = (req, res, next) => {
    User.findOne({ where: { id: req.params.id }})
    .then(User => {
        controle.log ('oldPasword   ' + req.body.oldPassword), 
        controle.log ('new pssaword    ' +User.password)
        bcrypt.compare(req.body.oldPassword, User.password)
            .then(valid => {

            if (!valid) {
                return res.status(401).json("Mot de passe actuel incorrect");
            }

            if (!schema.validate(req.body.password)) {
                return res.status(401).json('Le nouveau mot de passe doit avoir une longueur de 3 à 50 caractères avec au moins un chiffre, une minuscule, une majuscule !!!')
            }

                bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const newPassword = {
                        password : hash
                    };

                    user.update(newPassword, { where: { id: req.params.id }})
                    console.log('newpass   ' + newPassword)
                    .then(() => { res.status(201).json({ message: 'Mot de passe modifié !' })})
                    .catch(error => res.status(400).json({ error }));

                })
                .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}
