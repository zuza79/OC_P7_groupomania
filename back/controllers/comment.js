const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils.js');

exports.createComment = (req, res, next) => {
    console.log("console log comments    "+ (req.body.comments));
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    models.User.findOne({
        where: { id: userId }
    })
    console.log ("comment    " +userId)
if(user){
    models.Comment.create({
        
            content: req.body.content,
            userId: req.body.user.userId,
            postId: req.body.post.postId
        })
        .then(() => res.status(201).json({message: 'Commentaire créé !'}))
        .catch( error => res.status(400).json({error}));
}};

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