// controllers - user
// singup, login, delete, display one/all, modify
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hash = require('hash.js');
const fs = require('fs')

const models = require('../models')
const User = models.User;

// Regex
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d).{4,8}$/;

//////// SIGNUP
exports.signup = (req, res, next) => {
    console.log("console log signup backend  " +JSON.stringify(req.body.user));
        const user= req.body.user;
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
                       // image: image,
                        role: 0
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
    console.log('console log  bcrypt user.password: ' + user.password)
    console.log('console log  bcrypt password: ' + password)
                    .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !'} )
                    }
                    res.status(200).json({
                        userId: user.id,
                        role: user.role,     
                        token: jwt.sign(  {  
                             userId: user.id,   
                             role: user.role,    
                            token : 'RANDOM_TOKEN_SECRET',   
                            expiresIn: '24h'}    
                            )
                         });
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
exports.delete = (req, res, next) => {
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
            user.destroy({ where: { id: req.params.id } })

            .then(() => res.status(200).json({message : 'Utilisateur supprimé !'}))
            .catch( error => res.status(400).json({error}));
        }
    })
};
////// DISPLAY ONE USER
exports.getOneUser = (req, res, next) => {
    User.findOne({ where: { id: req.params.id } })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({error}));
};
////// DISPLAY ALL USERS

exports.getAllUsers = (req, res, next) => {
    console.log("get all users"  +JSON.stringify(req.body));
    User.findAll()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json(error))
};
////// MODIFY USER AND UPDATE
exports.modifyUser = (req, res, next) => {
    
    if (req.file) {

        User.findOne({ where: { id: req.params.id }})
        .then(User => {
            if (User.image) {
            const filename = User.image.split('/images/profiles/')[1];
            fs.unlink(`images/profiles/${filename}`, () => {
                const user= JSON.parse(req.body.user);
                const modifyUser = {
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    image: `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}`
                };
        user.update(modifyUser , { where: { id: req.params.id } })
            
                    .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
                    .catch( error => res.status(400).json({error}));
            })} else {
                const modifyUser = {
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    image: `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}`
                };
        
                user.update(modifyUser , { where: { id: req.params.id } })
        
                    .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
                    .catch( error => res.status(400).json({error}));
            }
        })
    } else {
        User.findOne({ where: { id: req.params.id }})
        .then(User => {
            if (User.image) {
                const filename = User.image.split('/images/profiles/')[1];
                fs.unlink(`images/profiles/${filename}`, () => {
                   
                    const modifyUser = {
                        nom: req.body.nom,
                        prenom: req.body.prenom,
                        email: req.body.email,
                        image: ''
                    };
                    //const user= JSON.parse(req.body.user);
                    user.update(modifyUser , { where: { id: req.params.id } })

                        .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
                        .catch( error => res.status(400).json({error}));
                })
            } else {
                const modifyUser = {
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    image: ''
                };
        
                user.update(modifyUser , { where: { id: req.params.id } })
        
                    .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
                    .catch( error => res.status(400).json({error}));
            }
        })
    }
    
    const modifyUser = {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        image: user.image,
    };

    user.update(modifyUser, { where: { id: req.params.id }
        })
        .then(()=> res.status(200).json({message : 'Utilisateur modifié !'}))
        .catch((error)=> res.status(400).json({error}));
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
    user.findOne({ where: { id: req.params.id }})
    .then(User => {
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
                    .then(() => { res.status(201).json({ message: 'Mot de passe modifié !' })})
                    .catch(error => res.status(400).json({ error }));

                })
                .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}
