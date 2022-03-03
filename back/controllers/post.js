// controllers post
// create, modify, delete, display one/all post
// display all post by user, modify post by admin
const jwtUtils = require('../utils/jwt.utils.js');
const fs = require('fs');
const models = require('../models');


// CREATE POST
exports.createPost = (req, res, next) => {
    // console.log("post          "+ JSON.stringify (req.body.title));
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const title = req.body.title;
    const content = req.body.content;   
   // let image = req.file;
    let image = "";
    if(!title || !content) {
        res.status(400).json({ 'erreur': 'paramètre manquant' });
    };
    //console.log("create 1 ");
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
      //  console.log("create 2 ");
        if(user) {  //console.log("create 3 ");
            models.Post.create({
                title : title,
                content: content,
              // image: image || "",
              image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}` || '',
                like: 0,
                dislike: 0,
                UserId: user.id,
                
            }).then( res.status(201).json({"message": "Nouveau post créé avec succès !"})
            ).catch(error => {
                console.log(error);
                res.status(400).json({erreur : erreur.message});
            });
                    
        } else {  //console.log("create 4 ");
            res.status(404).json({erreur : 'Utilisateur non trouvé!!'});
        };
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({erreur : erreur.message});
    });
};

// DISPLAY ONE POST
exports.getOnePost = (req, res, nest) => {
    console.log("getOnePost  " + req.body)
    models.Post.findOne({
        include: [{
            model : models.User
        }], 
         
        where: { id: req.params.id }})
    
     
    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
}


// DISPLAY ALL POSTS

exports.getAllPosts = (req, res, next) => {
    console.log("all post  " + req.body);
  
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
    models.Post.findAll({
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
    console.log("modify post   "+ req.body);
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);
    

    if (req.file) {

       models.Post.findOne({ where: { id: req.params.id }})
       
        .then(post => {
            console.log("post FindOne    "   + req.params.id)
            console.log("userId    "   + userId);
            console.log("post user.id     " + post.userId)


            if (userId === post.userId || role === 0) {
                if (post.image) {
                const filename = post.image.split('/images/posts/')[1];
                fs.unlink(`images/posts/${filename}`, () => {
                    const modifyPost = {
                        title: req.body.title,
                        content: req.body.content,
                        updatedAt: Date.now(),
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
                        updatedAt: Date.now(),
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
            if (userId === post.userId || role === 0) {
                if (post.image && req.body.image === '') {
                    const filename = post.image.split('/images/posts/')[1];
                    fs.unlink(`images/posts/${filename}`, () => {
                        const modifyPost = {
                            title: req.body.title,
                            content: req.body.content,
                            updatedAt: Date.now(),
                            //administration: false,
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
                        updatedAt: Date.now(),
                       // administration: false,
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

// DELETE POST
exports.deletePost = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);
    console.log("delete post   "+ req.body);

        models.Post.findOne({ where: { id: req.params.id }})
        
        .then(post => {
            console.log("post FindOne    "   + req.params.id)
            console.log("userId    "   + userId);
            console.log("post user.id     " + post.userId)
            if (userId === post.userId || role === 0)
            
            {
               
                if (post.image != null) {
                    const filename = post.image.split('/images/posts/')[1];
                    fs.unlink(`images/posts/${filename}`, () => {
                       models.Post.destroy({ where: { id: req.params.id } })

                        .then(() => res.status(200).json({message : 'Post supprimé !'}))
                        .catch( error => res.status(400).json({error}));
                    })
                
            
                } else {
                    models.Post.destroy({ where: { id: req.params.id } })

                    .then(() => res.status(200).json({message : 'Post supprimé !'}))
                    .catch( error =>{console.log(error); res.status(400).json({message :error.message}); });
                }
            } else {
                res.status(401).json({
                    message: 'Requête non autorisée !'
                });
            }
        })
        .catch( error =>{console.log(error); res.status(400).json({message :error.message}); });
}


//LIKE POST 
exports.likePost = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const postId = req.params.id;
    console.log('like post:    ' + req.body.like);

    models.Post.findOne({ where: { id: postId } })
        .then(post => {
            console.log("console post dataValues   "   +post.dataValues);
            post.update({
                like: req.body.like
            })
                .then(() => res.status(200).json({ message: 'Données mises à jour !' }))
                .catch((err) => res.status(500).json({ err }))
        })
        .catch(() => res.status(404).json({ error: 'Post introuvable !' }));
};