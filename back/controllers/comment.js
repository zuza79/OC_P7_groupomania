//// controllers - comment
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

//create comment
exports.createComment = (req, res, next) => {
    Comment.create({
            content: req.body.content,
            user_id: req.body.user_id,
            post_id: req.body.post_id
        })
        .then(() => res.status(201).json({message: 'Commentaire créé !'}))
        .catch( error => res.status(400).json({error}));
};
// delete comment
exports.deleteComment = (req, res, next) => {
    Comment.destroy({ where: { id: req.params.id } })

        .then(() => res.status(200).json({message : 'Commentaire supprimé !'}))
        .catch( error => res.status(400).json({error}));
};
//display post comment
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
// display all comments
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
//modify comment
exports.modifyComment = (req, res, next) => {
    Comment.findOne({ where: { id: req.params.id }})
        .then(() => {
            const modifyComment = {
                moderate: req.body.moderate
            };

            Comment.update(modifyComment , { where: { id: req.params.id } })

            .then(() => res.status(200).json({message : 'Commentaire modifié !'}))
            .catch( error => res.status(400).json({error}));
        })
    
};