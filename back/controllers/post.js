// controllers post
// create, modify, delete, display one/all post
// display all post by user, modify post LIKE/DISLIKE
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
   
    if(!title || !content) {
        res.status(400).json({ 'erreur': 'paramètre manquant' });
    }; 
   models.User.findOne({
        where: { id: userId }
    })
    .then(user => {
      //  console.log("create 2 ");
      if (req.file){  //  if(user) {               console.log("create 3 ");
            models.Post.create({
                title : title,
                content: content,
                image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`, // || ""
               // likes: 0,
                UserId: user.id,
                
            }).then( res.status(201).json({"message": "Nouveau post créé avec succès !"})
            ).catch(error => {
                console.log(error);
                res.status(400).json({erreur : erreur.message});
            });
                    
        } else {  //console.log("create 4 ");
            models.Post.create({
                title : title,
                content: content,
                likes: 0,
                UserId: user.id,
                
            }).then( res.status(201).json({"message": "Nouveau post créé avec succès !"})
            ).catch(error => {
                console.log(error);
                res.status(400).json({erreur : erreur.message});
            });
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
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    models.Post.findOne({
        where: { id : req.params.id },
        include: [{ model : models.User, 
                    attributes: [ 'nom','prenom', 'id' ]          
                    },
                /*  {model: models.Like,
                    attributes: [ 'PostId', 'UserId' ]
                },
                 	{model: models.Dislike,
                    attributes: [ 'PostId', 'UserId' ]
                }, 
                {model: models.Comment,
                    attributes: [ 'content', 'id' , 'updatedAt','createdAt', 'UserId','PostId' ],
                    include: [ { model: models.User, 
                                 attributes: [ 'nom','prenom','id' ] 
                                }] 
                 } 
                 */
    ],
        })
    
     
    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
}


// DISPLAY ALL POSTS

exports.getAllPosts = (req, res, next) => {
    console.log("all post  " + req.body);
  
    models.Post.findAll({ 
        order: [["id", "DESC"]],
        include: [{ model : models.User,
                    attributes: [ 'nom','prenom', 'id' ]
                 },
             /*   { model: models.Like, 
                   attributes: [ 'UserId' ] 
                }, 				
                {model: models.Dislike,
                attributes: ['UserId' ] 
                }, 
                 {model: models.Comment,
                attributes: [ 'content', 'id' , 'updatedAt','createdAt', 'UserId','PostId' ],
                include: [ { model: models.User, 
                             attributes: [ 'nom','prenom','id' ] 
                            }] 
                } 
        */
      ]})

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
        order: [["createdAt", "ASC"]],
       /* offset: 10 * req.body.pageNbr - 10,
        limit: 10*/
    
    })

    .then( posts => res.status(200).json(posts))
    .catch( error => res.status(400).json({error}))
};

// MODIFY POST only content or image
exports.modifyPost = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const role = jwtUtils.getRoleUser(headerAuth);
  //  console.log("consol log modify post   "+ req.body);

    if (req.file) {

       models.Post.findOne({ where: { id: req.params.id }})
        .then(post => {
            if (userId === post.userId || role === 0) {
                if (post.image) {
                const filename = post.image.split('/images/posts/')[1];
                fs.unlink(`images/posts/${filename}`, () => {
                    const modifyPost = {
                        content: req.body.content,
                        createdAt: Date.now(),
                        image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
                    };
        
                    models.Post.update(modifyPost , { where: { id: req.params.id } })
                
                        .then(() => res.status(200).json({message : 'Post modifié !'}))
                        .catch( error => res.status(400).json({error}));
                })} else {
                    const modifyPost = {
                        content: req.body.content,
                        createdAt: Date.now(),
                        image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
                    };
            
                    models.Post.update(modifyPost , { where: { id: req.params.id } })
            
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
        models.Post.findOne({ where: { id: req.params.id }})
        .then(post => {
            if (userId === post.userId || role === 0) {
                if (post.image && req.body.image === '') {
                    const filename = post.image.split('/images/posts/')[1];
                    fs.unlink(`images/posts/${filename}`, () => {
                        const modifyPost = {
                            content: req.body.content,
                            createdAt: Date.now(),
                            image: ''
                        };

                        models.Post.update(modifyPost , { where: { id: req.params.id } })

                            .then(() => res.status(200).json({message : 'Post modifié !'}))
                            .catch( error => res.status(400).json({error}));
                    })
                } else {
                    const modifyPost = {
                         content: req.body.content,
                         createdAt: Date.now(),
                       };
            
                    models.Post.update(modifyPost , { where: { id: req.params.id } })
            
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

        models.Post.findOne({
             where: { id: req.params.id }
            })
        
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
//////// LIKE/DISLIKE POST
//LIKE POST
exports.likePost = async (req, res, next) => {
    console.log("console LIKE  " +(req.body));
	try {
        const headerAuth = req.headers['authorization'];
		const userId = jwtUtils.getUserId(headerAuth);
		const postId = req.params.id;
		const user = await models.Like.findOne({
			where: { UserId: userId, PostId: postId }
		});
		if (user) {
			await models.Like.destroy(
				{ where: { UserId: userId, PostId: postId } },
				{ truncate: true, restartIdentity: true }
			);
			res.status(200).send({ messageRetour: "Neutre" });
		} else {
			await models.Like.create({
				UserId: userId,
				PostId: postId
			});
			res.status(201).json({ messageRetour: 'LIKE POST :)' });
		}
	} catch (error) {
		return res.status(500).send({ error: 'Erreur du serveur' });
	}
};

//DISLIKE POST
exports.dislikePost = async (req, res, next) => {
	try {
		const headerAuth = req.headers['authorization'];
		const userId = jwtUtils.getUserId(headerAuth);
		const postId = req.params.id;
		const user = await models.Dislike.findOne({
			where: { UserId: userId, PostId: postId }
		});
		if (user) {
			await models.Dislike.destroy(
				{ where: { UserId: userId, PostId: postId } },
				{ truncate: true, restartIdentity: true }
			);
			res.status(200).send({ messageRetour: "Neutre" });
		} else {
			await models.Dislike.create({
				UserId: userId,
				PostId: postId
			});
			res.status(201).json({ messageRetour: 'DISLIKE POST :(' });
		}
	} catch (error) {
		return res.status(500).send({ error: 'Erreur du serveur' });
	}
};

