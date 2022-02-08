// controllers post
// create, modify, delete, display one/all post
// display all post by user, modify post by admin

const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');


//////// CREATE POST
exports.createPost = (req, res, next) => {
   // console.log("console log create post  " +JSON.stringify(req.body.post));
    if (req.file) {
        Post.create({
            title: req.body.title,
            content: req.body.content,
            image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`,
            user_id: req.body.user_id
        })
        .then(() => res.status(201).json({message: 'Post créé !'}))
        .catch( error => res.status(400).json({error}));
    }/* else {
        Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.body.user_id
        })
        .then(() => res.status(201).json({message: 'Post créé !'}))
        .catch( error => res.status(400).json({error}));
    }*/
    
};


// DISPLAY ONE POST
exports.getOnePost = (req, res, nest) => {
    Post.findOne({
        include: [{
            model : User
        }], 
        where: { id: req.params.id }})
    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
}


// DISPLAY ALL POSTS

exports.getAllPosts = (req, res, next) => {
    
    Post.findAll({ 
        include: [{
            model : User
        },{
            model : Comment
        }],
        order: [["id", "DESC"]]})

    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
};


// DISPLAY ALL POSTS  - ONE USER

exports.getPostsUser = (req, res, next) => {
    Post.findAll({
        where: {
            user_id : req.params.user_id
        },
        include: [{
            model : User,
        }],
        order: [["created_date", "ASC"]]})

    .then( posts => res.status(200).json(posts))
    .catch( error => res.status(400).json({error}))
};

// MODIFY POST
exports.modifyPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId
    const role = decodedToken.role

    if (req.file) {

        Post.findOne({ where: { id: req.params.id }})
        .then(post => {
            if (userId === post.user_id || role === 1) {
                if (post.image) {
                const filename = post.image.split('/images/posts/')[1];
                fs.unlink(`images/posts/${filename}`, () => {
                    const modifyPost = {
                        title: req.body.title,
                        content: req.body.content,
                        updated_date: Date.now(),
                        administration: false,
                        image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
                    };
        
                    Post.update(modifyPost , { where: { id: req.params.id } })
                
                        .then(() => res.status(200).json({message : 'Profil modifié !'}))
                        .catch( error => res.status(400).json({error}));
                })} else {
                    const modifyPost = {
                        title: req.body.title,
                        content: req.body.content,
                        updated_date: Date.now(),
                        administration: false,
                        image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
                    };
            
                    Post.update(modifyPost , { where: { id: req.params.id } })
            
                        .then(() => res.status(200).json({message : 'Post modifié !'}))
                        .catch( error => res.status(400).json({error}));
                }
            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch(error => res.status(500).json({ error }));

    } else {
        Post.findOne({ where: { id: req.params.id }})
        .then(post => {
            if (userId === post.user_id || role === 1) {
                if (post.image && req.body.image === '') {
                    const filename = post.image.split('/images/posts/')[1];
                    fs.unlink(`images/posts/${filename}`, () => {
                        const modifyPost = {
                            title: req.body.title,
                            content: req.body.content,
                            updated_date: Date.now(),
                            administration: false,
                            image: ''
                        };

                        Post.update(modifyPost , { where: { id: req.params.id } })

                            .then(() => res.status(200).json({message : 'Post modifié !'}))
                            .catch( error => res.status(400).json({error}));
                    })
                } else {
                    const modifyPost = {
                        title: req.body.title,
                        content: req.body.content,
                        updated_date: Date.now(),
                        administration: false,
                    };
            
                    Post.update(modifyPost , { where: { id: req.params.id } })
            
                        .then(() => res.status(200).json({message : 'Post modifié !'}))
                        .catch( error => res.status(400).json({error}));
                }
            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
    }
}
// ADMINISTRATION POST BY ADMIN
exports.administrationPost = (req, res, nest) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const role = decodedToken.role

    Post.findOne({ where: { id: req.params.id }})
    .then(() => {
        if (role === 1) {
            const administration = {
                administration: req.body.administration
            };

            Post.update(administration, { where: { id: req.params.id }})
            .then(() => { res.status(201).json({ message: 'Modificatio effectué par administrateur !' })})
            .catch(error => res.status(400).json({ error }));
        } else {
            res.status(401).json({
                message: 'Requête non autorisée !' 
            });
        }
    })
    .catch(error => res.status(500).json({ error }));
}

// DELETE POST
exports.deletePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId
    const role = decodedToken.role

    Post.findOne({ where: { id: req.params.id }})
        .then(post => {
            if (userId === post.user_id || role === 0 || role === 1) {
                if (post.image != null) {
                    const filename = post.image.split('/images/posts/')[1];
                    fs.unlink(`images/posts/${filename}`, () => {
                        Post.destroy({ where: { id: req.params.id } })

                        .then(() => res.status(200).json({message : 'Post supprimé !'}))
                        .catch( error => res.status(400).json({error}));
                    })
                
            
                } else {
                    Post.destroy({ where: { id: req.params.id } })

                    .then(() => res.status(200).json({message : 'Post supprimé !'}))
                    .catch( error => res.status(400).json({error}));
                }
            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch( error => res.status(400).json({error}));
}

/////////// LIKE/DISLIKE
//LIKE POST 
exports.likePost = (req, res, next) => {
    switch (req.body.like) {
      case 0:    // default = 0  
      Post.findOne({ where: { id: postId } })   // find sauce by _id.
          .then((post) => {
            //LIKE
            if (post.usersLiked.find(user => user === req.body.userId)) {   
              Post.updateOne({ id: req.params.id }, {
                $inc: { likes: -1 },           
                $pull: { usersLiked: req.body.userId },     // if user LIKE, the body make update and user can't make another LIKE 
                id: req.params.id
              })
                .then(() => { res.status(201).json({ message: 'Merci.' }); })
                .catch((error) => { res.status(400).json({ error: error }); });
              //DISLIKE
            } if (post.usersDisliked.find(user => user === req.body.userId)) {      
              Post.updateOne({ id: req.params.id }, {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },      
                id: req.params.id
              })
                .then(() => { res.status(201).json({ message: ' Merci.' }); })
                .catch((error) => { res.status(400).json({ error: error }); }); 
            }
          })
          .catch((error) => { res.status(404).json({ error: error }); });
        break;
  
        //update LIKE
      case 1:
        Post.updateOne({ id: req.params.id }, {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
          id: req.params.id
        })
          .then(() => { res.status(201).json({ message: 'Ton like a été pris en compte! Merci.' }); })
          .catch((error) => { res.status(400).json({ error: error }); });
        break;
  
        // update DISLIKE
      case -1:
        Post.updateOne({ _id: req.params.id }, {
          $inc: { dislikes: +1 },
          $push: { usersDisliked: req.body.userId },
          id: req.params.id
        })
          .then(() => { res.status(201).json({ message: 'Ton dislike a été pris en compte!' }); })
          .catch((error) => { res.status(400).json({ error: error }); });
        break;
        default:
    }
  };
