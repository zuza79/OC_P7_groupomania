// controllers post
// create, modify, dele, display one/all post
// display all post by user, modify post by admin
const jwtUtils = require('../utils/jwt.utils.js');


// Importation des modèles
const models = require('../models');


// ----->Controllers<-----
// Création d'un nouveau post
exports.createPost = (req, res, next) => {
     console.log("post          "+ JSON.stringify (req.body));

    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const title = req.body.title;
    const content = req.body.content;    
    let image = req.file

    if(!content || !title) {
        res.status(400).json({ 'erreur': 'paramètre manquant' });
    };

     /*   } else {
        image = `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`;
        if(image.length > 150) {
            res.status(400).json({ 'erreur': 'Nom de l\'image invalide' })
        };
    }*/

    models.User.findOne({
        where: { id: userId }
    })
    .then(user => {
        if(user) {
            models.Post.create({
                title : title,
                content: content,
                image: image,
                like: 0,
                dislike: 0,
                UserId: user.id
            })
            res.status(201).json({"message": "Nouveau post créé avec succès !"})
                    
        } else {
            res.status(404).json({'erreur' : 'Utilisateur introuvable'});
        };
    })
    .catch(err => {
        res.status(500).json({ 'err': 'ERREUR !!!' });
    });
};

/*
const jwtUtils = require('../utils/jwt.utils.js');
const fs = require('fs');
const models = require('../models');
const User = models.User;
const Post = models.Post;
//////// CREATE POST
exports.createPost = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    
  //  console.log("post"+ JSON.stringify (req.body.post));
    const post = req.body.post;    
    // console.log ("___________________________"+req.file)
    let image = "";
    /*try{
        image = `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`;
    }
    catch(erreur){
        console.log(erreur);
    }*/
// verifier les champs du post sauf image 
 /*   if(!post) {
        res.status(400).json({ 'erreur': 'paramètre manquant' });
    };
    User.findOne({
        where: { id: userId }
    })
    .then(user => {
        if(user) {
           Post.create ({
				include: [ {model: models.User,}],
                title: post.title,
				content: req.body.post.content || "",
				image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`|| '',
                UserId: user.id,
                like: 0,
                dislike: 0,
			}).then(
                res.status(201).json({"message": "Nouveau post créé avec succès !"})
            
            ).catch( error => { console.log(error);  
            res.status(500).send({'erreur' : 'erreur insertion dans la base de données'});});
           
                    
        } else {
            res.status(400).json({'erreur' : 'Utilisateur introuvable'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ "erreur": "erreur!!! catch"});
    });
    
};
*/
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
    console.log("all post  " + req.body)
    models.Post.findAll({ 
        include: [{
            model : models.User
        }
    ],
        order: [["id", "DESC"]]})

    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
};


// DISPLAY ALL POSTS  - ONE USER

exports.getPostsUser = (req, res, next) => {
    Post.findAll({
        where: {
            userId : req.params.user.id
        },
        include: [{
            model : models.User,
        }],
        order: [["created_date", "ASC"]]})

    .then( posts => res.status(200).json(posts))
    .catch( error => res.status(400).json({error}))
};

// MODIFY POST
exports.modifyPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRET_KEY_TOKEN');
    const userId = decodedToken.userId
    const role = decodedToken.role

    if (req.file) {

        Post.findOne({ where: { id: req.params.id }})
        .then(post => {
            if (userId === post.user.id || role === 0) {
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
            if (userId === post.user.id || role === 0) {
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
    const decodedToken = jwt.verify(token, 'SECRET_KEY_TOKEN');
    const role = decodedToken.role

    Post.findOne({ where: { id: req.params.id }})
    .then(() => {
        if (role === 0) {
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
    console.log("post   "+ req.body);
        models.Post.findOne({ where: { id: req.params.id }})
        
        .then(Post => {
            console.log("post FindOne    "   + req.params.id);
            if (userId === post.user.id || role === 0) {
               
                if (post.image != null) {
                    const filename = post.image.split('/images/posts/')[1];
                    fs.unlink(`images/posts/${filename}`, () => {
                        Post.destroy({ where: { id: req.params.id } })

                        .then(() => res.status(200).json({message : 'Post supprimé !'}))
                        .catch( error => res.status(400).json({error}));
                    })
                
            
                } else {
                    post.destroy({ where: { id: req.params.id } })

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
    const postId = req.params.id;
    switch (req.body.like) {
      case 0:    // default = 0  
      models.Post.findOne({ where: { id: postId } })   // find sauce by _id.
          .then((post) => {
            //LIKE
            if (post.usersLiked.find(user => user === req.body.id)) {   
              Post.updateOne({ id: req.params.id }, {
                $inc: { likes: -1 },           
                $pull: { usersLiked: req.body.id },     // if user LIKE, the body make update and user can't make another LIKE 
                id: req.params.id
              })
                .then(() => { res.status(201).json({ message: 'Merci.' }); })
                .catch((error) => { res.status(400).json({ error: error }); });
              //DISLIKE
            } if (post.usersDisliked.find(user => user === req.body.id)) {      
              Post.updateOne({ id: req.params.id }, {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.id },      
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
          $push: { usersLiked: req.body.id },
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