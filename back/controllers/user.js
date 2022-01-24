// controllers - user
// singup, save, login, delete, display one/all, modify
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const emailValidator = require('email-validator');
const fs = require('fs');

const user = require('../models/user');

const schema = new passwordValidator(); //min 3, max 15, 1 uppercace, 1 lowercace, 1 number
schema
  .is().min(3)
  .is().max(15)
  .has().uppercase(1)
  .has().lowercase(1)
  .has().digits(1)

////////// SIGNUP
  exports.signup = (req, res, next) => {
    if (!emailValidator.validate(req.body.email)){
        return res.status(401).json({message: 'Veuillez saisir votre email valide'});
    }
    if (!schema.validate(req.body.password)){
        return res.status(401).json({message: 'Le mot de passe doit contenir min 3 et max 15 caractères avec au moins un chiffre, une minuscule, une majuscule !!!'});
    };
    bcrypt.hash(req.body.password, 10)
        .then(hash =>{
            user.create({
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                password: hash,
                image: req.body.image,
                role: req.body.role
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(() => res.status(400).json('Votre adresse email est déjà utilisé !'));
        })
        .catch(error => res.status(500).json({message : 'Problem de serveur'}));
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






