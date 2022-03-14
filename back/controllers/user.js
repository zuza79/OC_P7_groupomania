// controllers - user
// singup, login, delete, display one/all, modify
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const hash = require('hash.js');
const fs = require('fs')

const models = require('../models')
const User = models.User;
const Post = models.Post;

// REGEX
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d).{4,8}$/;

//////// SIGNUP
exports.signup = (req, res, next) => {
    console.log("console log signup backend  " + JSON.stringify(req.body));
    const user = req.body;
    //const user= JSON.parse(req.body.user); 
    const email = user.email;
    const password = user.password;
    const nom = user.nom;
    const prenom = user.prenom;

    if (email == null || password == null || nom == null || prenom == null) {
        return res.status(400).json({ 'erreur': 'paramètres manquants' });
    }
    if (nom.length > 20 || nom.length < 2) {
        return res.status(400).json({ 'erreur': 'prénom invalide (doit être entre 2 et 20 caractères)' })
    }
    if (prenom.length > 20 || prenom.length < 2) {
        return res.status(400).json({ 'erreur': 'nom invalide (doit être entre 2 et 20 caractères)' })
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 'erreur': 'email invalide' })
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 'erreur': 'mot de passe invalide (doit contenir entre 4 et 8 caractères et au moins un chiffre)' })
    }

    User.findOne({
        attributes: ['email'],
        where: { email: email }
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(password, 10)
                    .then(hash => {
                        const newUser = models.User.create({
                            email: email,
                            password: hash,
                            nom: nom,
                            prenom: prenom,
                            image: req.body.image || "",
                            role: 1

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
        .catch(err => {
            console.log("erreur signUp" + err);
            return res.status(500).json({ err });
        })
};

///////// LOGIN
exports.login = (req, res, next) => {
    console.log("console login backend debut" + JSON.stringify(req.body));
    // const user= req.body.user;
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({ 'erreur': 'paramètres manquants' });
    }

    User.findOne({
        where: { email: email }
    })
        .then(user => {
            if (!user) {
                return res.status(401).json('Utilisateur non trouvé !');
            }
            console.log("console user  " + req.body.password);
            console.log("console user  " + user.password);

            bcrypt.compare(password, user.password)
                //console.log('console log  bcrypt user.password: ' + user.password)
                //console.log('console log  bcrypt password: ' + password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !' })
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
        .catch(err => {
            console.log("erreur login  " + err);
            return res.status(500).json({ err });
        });
}



/////////////// DELETE USER
exports.deleteUser = (req, res, next) => {
    console.log("console login delete user" + JSON.stringify(req.body));
    // Récupération de l'ID de l'utilisateur dans le token
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    User.findOne({ where: { id: userId } })
        .then(user => {

            // Suppression de la photo de l'utilisateur
            let imageProfile = user.image.split('/images/profiles/')[1];
            fs.unlink(`images/profiles/${imageProfile}`, (error) => {
                if(error){
                    console.log("Echec de suppression de l'image : " + error);
                } else {
                    console.log("Image supprimée avec succès !");
                };
            });

            Post.findAll({
                attributes: ['image'],
                where: { userId: user.id }
            })
                .then((posts) => {

                    // Suppression des images des posts de l'utilisateur
                    for(i = 0; i < posts.length; i++){
                        if(posts[i].dataValues.image){
                            console.log(posts[i].dataValues.image.split('images/posts/')[1]);
                            fs.unlink(`images/posts/${posts[i].dataValues.image.split('images/posts/')[1]}`, (error) => {
                                if(error){
                                    console.log("Echec de suppression de l'image : " + error);
                                } else {
                                    console.log("Image supprimée avec succès !");
                                };
                            })
                        }
                    }
                    
                    // Suppression des posts de l'utilisateur
                    Post.destroy({ where: {userId: userId} })
                        .then(() => {

                            // Suppression de l'utilisateur de la BDD
                            User.destroy({ where: { id: userId } })
                                .then(() => res.status(200).json({ message: 'Utilisateur supprimé avec succès' }))
                                .catch(() => res.status(500).json({ message: "L'utilisateur n'a pas pu être supprimé !" }))
                        })
                        .catch(() => res.status(500).json({ error: "Les publications n'ont pas pu être supprimées ! " }))
                })
                .catch(() => res.status(500).json({ message: "Les posts n'ont pas pu être supprimés !"}))

        })
        
        .
     
            // DELETE COMMENTS
            Comment.findAll({ where: { userId: user.id } })
            then((comments) => {
                for(i = 0; i < comments.length; i++)
            Comment.destroy({ where: {userId: userId} })
                .then(() => {

                    
                    User.destroy({ where: { id: userId } })
                        .then(() => res.status(200).json({ message: 'Utilisateur supprimé avec succès' }))
                        .catch(() => res.status(500).json({ message: "L'utilisateur n'a pas pu être supprimé !" }))
                    Post.destroy({ where: { id: userId } })
                        .then(() => res.status(200).json({ message: 'Publication supprimé avec succès' }))
                        .catch(() => res.status(500).json({ message: "Publication n'a pas pu être supprimé !" }))
                })
                .catch(() => res.status(500).json({ error: "Les publications n'ont pas pu être supprimées ! " }))
        })
        .catch(() => res.status(500).json({ message: "Les posts n'ont pas pu être supprimés !"}))


}
/*
exports.deleteUser = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);
    console.log("delete user   " + req.params.id);

    if (userId == req.params.id || role == 0) {

        User.findOne({ where: { id: req.params.id } })

            .then(user => {
                console.log("user FindOne    " + user.id)
                if(user){

                    if (user.image != null) {
                        const filename = user.image.split('/images/profiles/')[1];
                        fs.unlink(`images/profiles/${filename}`, (error) => {
                           // console.log(error.message);
                            });
                    } 

                    User.destroy({ where: { id: req.params.id } })
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
                    .catch(error =>{ console.log(error); res.status(400).json({ message : error.message })});
            
                }
               else{  console.log("user not found");
                res.status(404).json({ 'erreur': 'Utilisateur non trouvé !' })
               }
             } ).catch(error => {  res.status(500).json({ message : error.message }) })

    } else {
        res.status(403).json({ message: 'Action non autorisé !' });
    }
    Post.findAll({
        
        where: {id: req.params.id }
    })
        .then((posts) => {

            // Suppression des images des posts de l'utilisateur
            for(i = 0; i < posts.length; i++){
                if(posts[i].dataValues.image){
                    console.log(posts[i].dataValues.image.split('images/posts')[1]);
                    fs.unlink(`images/posts/${posts[i].dataValues.image.split('images/posts')[1]}`, (error) => {
                        if(error){
                            console.log("Echec de suppression de l'image : " + error);
                        } else {
                            console.log("Image supprimée avec succès !");
                        };
                    })
                }
            }
            // DELETE POST USER
            Post.destroy({ where: {id: req.params.id} })
            .then(() => {

                // DELETE POST USER
                User.destroy({ where: { id: req.params.id } })
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé avec succès' }))
                    .catch(() => res.status(500).json({ message: "L'utilisateur n'a pas pu être supprimé !" }))
            })
            .catch(() => res.status(500).json({ error: "Les publications n'ont pas pu être supprimées ! " }))
            // DELETE COMMENT USER
            Post.destroy({ where: {id: req.params.id} })
            .then(() => {

                // DELETE COMMENT USER
                User.destroy({ where: { id: req.params.id } })
                    .then(() => res.status(200).json({ message: 'Utilisateur supprimé avec succès' }))
                    .catch(() => res.status(500).json({ message: "L'utilisateur n'a pas pu être supprimé !" }))
            })
            .catch(() => res.status(500).json({ error: "Les publications n'ont pas pu être supprimées ! " }))
})};

*/
////// DISPLAY ONE USER

exports.getOneUser = (req, res, next) => {
    const userId = req.params.id;
    User.findOne({
        attributes: ['id', 'email', 'nom', 'prenom', 'image'],
        where: { id: userId }
    }).then((user) => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ 'erreur': 'Utilisateur non trouvé !' })
        }
    }).catch(err => res.status(500).json({ err }))
}


////// DISPLAY ALL USERS

exports.getAllUsers = (req, res, next) => {
    console.log("get all users" + JSON.stringify(req.body));
    User.findAll()
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status(400).json(error))
};

////// MODIFY USER AND UPDATE
exports.modifyUser = (req, res, next) => {
    console.log("modif info users" + JSON.stringify(req.body));
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);

    const email = req.body.email
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const image = req.file ? `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}` : null;
   // const image = `${req.protocol}://${req.get('host')}/images/profiles/${req.file.filename}`;
   
    
    User.findOne({
        attributes: ['id', 'email', 'nom', 'prenom', 'image'],
        where: { id: userId }
    })
        .then(user => {
            if(userId === user.id || role === 0) {

                
                if(image != null) {
                    const filename = user.image.split('/images/profiles')[1];
                    fs.unlink(`images/${filename}`, (error) => {
                        if(error){
                            console.log("Echec de suppression de l'image : " + error);
                        } else {
                            console.log("Image supprimée avec succès !");
                        };
                    });
                };

                // UPDATE PROFILE, new info
                user.update({
                    email: (email ? email : user.email),
                    nom: (nom ? nom : user.nom),
                    prenom: (prenom ? prenom : user.prenom),
                    image: (image ? image : user.image)
                })
                .then(user => {
                    if(userId === user.id || role === 0){
                        return res.status(201).json(user)
                    } else {
                        res.status(500).json({ 'erreur': 'Impossible de mettre a jour le profil de l\'utilisateur' })
                    }
                })
                .catch(() => {
                    res.status(500).json({ 'erreur': 'impossible de mettre à jour l\'utilisateur' })
                });
            } else {
                res.status(404).json({ 'erreur': 'Utilisateur introuvable !' })
            }
        })
        .catch(() => {
            res.status(500).json({ 'erreur': 'impossible de vérifier l\'utilisateur' })
        })
    
}


//MODIFY PASSWORD
exports.modifyPassword = (req, res, next) => {
    console.log("modif password" + JSON.stringify(req.body));
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);

User.findOne({ where: { id: userId } })
        .then(user => {
            if(userId === user.id || role === 0) {
                controle.log('oldPasword   ' + req.body.oldPassword),
                controle.log('new pssaword    ' + user.password)
            bcrypt.compare(req.body.oldPassword, user.password)
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
                                password: hash
                            };

                            user.update(newPassword, { where: { id: req.params.id } })
                            console.log('newpass   ' + newPassword)
                                .then(() => { res.status(201).json({ message: 'Mot de passe modifié !' }) })
                                .catch(() => res.status(400).json({message: "imposible de modifier mot de pass" }));

                        })
                        .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        }})
        .catch(error => res.status(500).json({ error }));
}

