const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
//const models = require('../models');
const jwtUtils = require('../utils/jwt.utils.js');

exports.createComment = (req, res, next) => {
    console.log("console log comments    "+ JSON.stringify (req.body.comment));
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    models.Comment.create({
            content: req.body.content,
            userId: req.body.userId,
            postId: req.body.postId
        })
        .then(() => res.status(201).json({message: 'Commentaire créé !'}))
        .catch( error => res.status(400).json({error}));
};

exports.deleteComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);

    Comment.destroy({ where: { id: req.params.id } })

    .then((comment) => {
        if (userId === comment.user_id || role === 0 || role === 1) {
            res.status(200).json({message : 'Commentaire supprimé !'})

        } else {
            res.status(401).json({
                message: 'Requête non autorisée !'
            });
        }
    })
    .catch( error => res.status(400).json({error}));
};

exports.getPostComments = (req, res, next) => {
    Comment.findAll({
        where: {
        post_id : req.params.post_id
    },
        include: [{
        model : User,
    }],
        order: [["date", "ASC"]]})

    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};

exports.getAllComments = (req, res, next) => {
    Comment.findAll({
        include: [{
            model : User
        },{
            model : Post
        }],
        order: [["date", "ASC"]]
    })

    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};

exports.modifyComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const role = decodedToken.role

    Comment.findOne({ where: { id: req.params.id }})
        .then(() => {
            if (role === 1) {
                const modifyComment = {
                    moderate: req.body.moderate
                };

                Comment.update(modifyComment , { where: { id: req.params.id } })

                .then(() => res.status(200).json({message : 'Commentaire modifié !'}))
                .catch( error => res.status(400).json({error}));

            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch( error => res.status(400).json({error}))
};