const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const models = require('../models');

const jwtUtils = require('../utils/jwt.utils.js');

// CREATE COMMENT
exports.createComment = (req, res, next) => {
  console.log("console log create comment  " + JSON.stringify (req.body));
  
  console.log("console log userId  " +req.body.userId)
  console.log("console log id  " +req.body.id)
  console.log("console log postId  " +req.body.postId)
  console.log("console log content  " +req.body.content)
   

  models.Comment.create({
        
            id: req.body.id,
            content: req.body.content,
            UserId: req.body.userId,
            PostId: req.body.postId
        })
        
        
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

   

    .then(comment => {
        if (userId === comment.UserId || role === 0) 
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
// DISPLAY ALL COMMENTS OF POST
exports.getPostComments = (req, res, next) => {
    console.log("console log getPostComment  " + JSON.stringify (req.body));
    models.Comment.findOne({ 
        where: { id: req.params.id }})
        console.log("findOneComm   " +id )
        
    models.Comment.findAll({
        where: {
        postId : req.params.postId
    },
        include: [{
        model : models.User,
    }],
    
        order: [["createdAt", "ASC"]]})
        
console.log("findallComm   " +postId )
    .then( res.status(201).json({"message": "Commentaires afficher"}))
    .catch( error => {
        console.log(error);
        res.status(400).json({"message": "Erreur affichager des commentaires "});
});
}
// DISPLAY ALL COMMENTS 
exports.getAllComments = (req, res, next) => {
    console.log("console log getAllComment  " +(req.body));

    models.Comment.findAll({
        include: [{
            model : models.User
        },{
            model : models.Post
        }],
        order: [["createdAt", "DESC"]],
      /*  offset: 10 * req.body.pageNbr - 10,
        limit: 10   */
    })

    .then( comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};
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