const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const models = require('../models');

const jwtUtils = require('../utils/jwt.utils.js');

// CREATE COMMENT
exports.createComment = (req, res, next) => {
  console.log("console log create comment  " +(req.body));
  const headerAuth = req.headers['authorization'];
  const userId = jwtUtils.getUserId(headerAuth);
  

  models.Comment.create({
        
            id: req.body.id,
            content: req.body.content,
            userId: req.body.userId,
            postId: req.body.postId
          /*  UserId: userId,
            PostId: req.params.id */
        })
   /* console.log("console log userId  " +req.body.userId)
  console.log("console log id  " +req.body.id)
  console.log("console log postId  " +req.body.postId)
  console.log("console log content  " +req.body.content)
   */  
        
        .then(() => res.status(201).json({message: 'Commentaire créé !'}))
        .catch( error => res.status(400).json({error}));
};
// DELETE COMMENT
exports.deleteComment = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);

    models.Comment.findOne({
        where: { id: req.params.id }
       })

   

    .then(Comment => {
        if (userId === Comment.userId || role === 0) 
        {
             models.Comment.destroy({ where: { id: req.params.id } })
            res.status(200).json({message : 'Commentaire supprimé !'})

        } else {
            res.status(401).json({
                message: 'Requête non autorisée !'
            });
        }
    })
    .catch( error => res.status(400).json({error}));
};
// DISPLAY ONE COMMENT
exports.getPostComments = (req, res, next) => {
   console.log("console log getPostComments  " +(req.body));
    models.Comment.findAll({
        
        where: { postId : req.params.postId },
       include: [{  model : models.User}],
        order: [["createdAt", "DESC"]]//
    })
   // console.log("console log id  " +req.params.id)
 //console.log("console log id  " +req.params.id)
    .then(comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};
// DISPLAY ALL COMMENTS
exports.getAllComments = (req, res, next) => {
    console.log("console log getPostAllComments  " +(req.body));
    models.Comment.findAll({
        //where: {
       // postId : req.params.postId
    //},
        include: [
            { model : models.User},
            { model : models.Post}],
        order: [["createdAt", "DESC"]]})

    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};
// DISPLAY ALL COMMENTS 
/*exports.getPostAllComments = (req, res, next) => {
    console.log("console log getAllComment  " +(req.body));

    models.Comment.findAll({
        include: [{
            model : models.User
        },{
            model : models.Post
        }],
        order: [["createdAt", "DESC"]],
     
    })

    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};*/
//MODIFY COMMENT
exports.modifyComment = (req, res, next) => {
    console.log("console log modifyComment  " +(req.body));
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);

    models.Comment.findOne({ where: { id: req.params.id }})
        .then(comment => {
            if (userId === comment.userId || role === 0) {
                const modifyComment = {content: req.body.content};
                models.Comment.update(modifyComment , { where: { id: req.params.id } })

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