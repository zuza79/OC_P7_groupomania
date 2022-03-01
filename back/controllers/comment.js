//const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils.js');
const fs = require('fs');

//CREATE COMMENT
exports.createComment = (req, res, next) => {
    console.log("console log comments    "+ (req.body));
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const postId = req.body.post.id;
    const content = req.body.content;

    models.User.findOne({
        where: { id: userId }
    })
    

    .then(user => {
        console.log("console log userId   " +userId)
        
if(user){ console.lot("verif console create")
    models.Comment.create({
        
            content: content,
            userId: userId,
            postId: postId,
        })
        .then(() => res.status(201).json({message: 'Commentaire publier !'}))
        .catch( error => res.status(400).json({error}));
}})};
//DELETE COMMENT
exports.deleteComment = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);
    console.log("delete comment   "+ req.body);

    models.Comment.destroy({ where: { id: req.params.id } })

    .then((comment) => {
        if (userId === comment.userId || role === 0) {
            res.status(200).json({message : 'Commentaire supprimé !'})

        } else {
            res.status(401).json({
                message: 'Requête non autorisée !'
            });
        }
    })
    .catch( error => res.status(400).json({error}));
};
// DISPLAY ONE POST WITH COMMENTS
exports.getPostComments = (req, res, next) => {
    models.Comment.findAll({
        where: {
        postId : req.params.postId
    },
        include: [{
        model : User,
    }],
        order: [["date", "ASC"]]})

    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};

//DISPLAY ALL COMMENTS
exports.getAllComments = (req, res, next) => {
    models.Comment.findAll({
        include: [{
            model : User
        },{
            model : Post
        }],
        order: [["date", "ASC"]]
    })

    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({message: "impossible display comments"}))
};

// MODIFY COMMENT BY ADMIN
exports.modifyComment = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const role = jwtUtils.getRoleUser(headerAuth);
    console.log("modify comment   "+ req.body);

    Comment.findOne({ where: { id: req.params.id }})
        .then(() => {
            if (role === 0) {
                const modifyComment = {
                    role: req.body.role
                };

                Comment.update(modifyComment , { where: { id: req.params.id } })

                .then(() => res.status(200).json({message : 'Commentaire modifié par administrateur!'}))
                .catch( error => res.status(400).json({error}));

            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch( error => res.status(400).json({error}))
};