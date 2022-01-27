// controllers - user
// singup, save, login, delete, display one/all, modify
// Importation des modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs')

// Importation des modèles
const models = require('../models')


// Création des Regex
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d).{4,8}$/;


// -----> Controllers <-----
//////// SIGNUP
exports.signup = (req, res, next) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

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

    models.user.findOne({
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
                        image: image,
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
    .catch(err => {
        return res.status(500).json({ err });
    })
};

////////// LOGIN
exports.login = (req, res, next) => {
    user.findOne({ where: {email: req.body.email} })
            .then(user => {

            if (!user) {
                return res.status(401).json('Utilisateur non trouvé !');
            }
            
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {

                    if (!valid) {
                        return res.status(401).json('Mot de passe incorrect !');
                    }

                    res.status(200).json({
                        userId: user.id,
                        image: user.image,
                        role: user.role,
                        token: jwt.sign(
                            {userId: user.id},
                            process.env.TOKEN, 
                            {expiresIn: '5h'} 
                        )
                    }); 
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};
/////////////// DELETE
exports.delete = (req, res, next) => {
    user.findOne({ where: { id: req.params.id }})
    .then(User => {
        if (User.image != null) {
            const filename = User.image.split('/images/profiles/')[1];
            fs.unlink(`images/profiles/${filename}`, () => {
                user.destroy({ where: { id: req.params.id } })

                .then(() => res.status(200).json({message : 'Utilisateur supprimé !'}))
                .catch( error => res.status(400).json({error}));
            })
        } else {
            user.destroy({ where: { id: req.params.id } })

            .then(() => res.status(200).json({message : 'Utilisateur supprimé !'}))
            .catch( error => res.status(400).json({error}));
        }
    })
}
////// DISPLAY ONE USER
exports.getOneUser = (req, res, next) => {
    user.findOne({ where: { id: req.params.id } })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({error}));
};
////// DISPLAY ALL USERS
exports.getAllUsers = (req, res, next) => {
    user.findAll()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json(error))
};
////// MODIFY USER AND UPDATE
exports.modifyUser = (req, res, next) => {
    if (req.file) {

        user.findOne({ where: { id: req.params.id }})
        .then(User => {
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
        })
    } else {
        user.findOne({ where: { id: req.params.id }})
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

                    user.update(modifyUser , { where: { id: req.params.id } })

                        .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
                        .catch( error => res.status(400).json({error}));
                })
            } else {
                const modifyUser = {
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    image: ''
                };
        
                user.update(modifyUser , { where: { id: req.params.id } })
        
                    .then(() => res.status(200).json({message : 'Utilisateur modifié !'}))
                    .catch( error => res.status(400).json({error}));
            }
        })
    }
    
    const modifyUser = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        image: req.body.image,
    };

    user.update(modifyUser, { where: { id: req.params.id }
        })
        .then(()=> res.status(200).json({message : 'Utilisateur modifié !'}))
        .catch((error)=> res.status(400).json({error}));
};
