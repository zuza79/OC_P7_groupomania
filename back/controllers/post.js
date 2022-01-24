// controllers post
// create, modify, delete, display one/all post
// display all post by user, modify post by admin
const Post = require('../models/post');
const User = require('../models/user');
const fs = require('fs');
//const { DATE } = require('sequelize/dist');

exports.createPost = (req, res, next) => {
    if (req.file) {
        Post.create({
            title: req.body.title,
            content: req.body.content,
            image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`,
            user_id: req.body.user_id
        })
        .then(() => res.status(201).json({message: 'Post créé !'}))
        .catch( error => res.status(400).json({error}));
    } else {
        Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.body.user_id
        })
        .then(() => res.status(201).json({message: 'Post créé !'}))
        .catch( error => res.status(400).json({error}));
    }
    
};
//// modify post
exports.modifyPost = (req, res, next) => {
    if (req.file) {

        Post.findOne({ where: { id: req.params.id }})
        .then(post => {
            if (post.image) {
            const filename = post.image.split('/images/posts/')[1];
            fs.unlink(`images/posts/${filename}`, () => {
                const modifyPost = {
                    title: req.body.title,
                    content: req.body.content,
                    updated_date: Date.now(),
                    moderate: false,
                    image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
                };
    
                Post.update(modifyPost , { where: { id: req.params.id } })
            
                    .then(() => res.status(200).json({message : 'Post modifié !'}))
                    .catch( error => res.status(400).json({error}));
            })} else {
                const modifyPost = {
                    title: req.body.title,
                    content: req.body.content,
                    updated_date: Date.now(),
                    moderate: false,
                    image: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`
                };
        
                Post.update(modifyPost , { where: { id: req.params.id } })
        
                    .then(() => res.status(200).json({message : 'Post modifié !'}))
                    .catch( error => res.status(400).json({error}));
            }
        })
        .catch(error => res.status(500).json({ error }));

    } else {
        Post.findOne({ where: { id: req.params.id }})
        .then(post => {
            if (post.image) {
                const filename = post.image.split('/images/posts/')[1];
                fs.unlink(`images/posts/${filename}`, () => {
                    const modifyPost = {
                        title: req.body.title,
                        content: req.body.content,
                        updated_date: Date.now(),
                        moderate: false,
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
                    moderate: false,
                };
        
                Post.update(modifyPost , { where: { id: req.params.id } })
        
                    .then(() => res.status(200).json({message : 'Post modifié !'}))
                    .catch( error => res.status(400).json({error}));
            }
        })
        .catch(error => res.status(500).json({ error }));
    }
}

////// delete post
exports.deletePost = (req, res, next) => {
    Post.findOne({ where: { id: req.params.id }})
        .then(post => {
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
        })
}
//// display all post
exports.getAllPosts = (req, res, next) => {
    
    Post.findAll({ 
        include: [{
            model : User
        }],
        order: [["id", "DESC"]]})

    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
};
//// display one post
exports.getOnePost = (req, res, nest) => {
    Post.findOne({
        include: [{
            model : User
        }], 
        where: { id: req.params.id }})
    .then( post => res.status(200).json(post))
    .catch( error => res.status(400).json({error}))
}
////// display all post of user
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
//// modify post by administrateur
exports.moderatePost = (req, res, nest) => {
    Post.findOne({ where: { id: req.params.id }})
    .then(() => {
        const moderation = {
            moderate : req.body.moderate
        };

        Post.update(moderation, { where: { id: req.params.id }})
        .then(() => { res.status(201).json({ message: 'Moderation effectué !' })})
        .catch(error => res.status(400).json({ error }));

    })
    .catch(error => res.status(500).json({ error }));
}