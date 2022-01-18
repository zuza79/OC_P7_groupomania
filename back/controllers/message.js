// Importation des modules
const jwtAuth = require('../middleware/auth');


// Importation des modèles
const models = require('../models');


// ----->Controllers<-----
// create new message
exports.createMessage = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtAuth.getUserId(headerAuth);
    const textContent = req.body.textContent;    
    let imageContent = req.file

    if(!textContent && !imageContent) {
        res.status(400).json({ 'erreur': 'paramètre manquant' });
    };

    if(textContent){
        if(textContent.length > 150) {
            res.status(400).json({ 'erreur': 'Texte trop long (150 caractères maximum)' })
        };
    } else {
        imageContent = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        if(imageContent.length > 150) {
            res.status(400).json({ 'erreur': 'Nom de l\'image invalide' })
        };
    }

    models.User.findOne({
        where: { id: userId }
    })
    .then(user => {
        if(user) {
            models.Message.create({
                textContent: textContent,
                imageContent: imageContent,
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


// display all message
exports.getAllMessage = (req, res, next) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    models.Message.findAll({
        order: [(order != null) ? order.split(':') : ['id', 'DESC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: models.User,
            attributes: ['id','firstname', 'lastname', 'photo', 'profile']
        }]

        
    }).then(messages => {
        if(messages){
            res.status(200).json(messages);
        } else {
            res.status(404).json({ "erreur": "Aucun message trouvé"});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ "erreur": "Champs invalides"});
    });
};


// Récupération des messages d'un utilisateur
exports.getUserMessage = (req, res, next) => {
    const userId = req.params.id;
    
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    models.Message.findAll({
        where: {userId: userId},
        order: [(order != null) ? order.split(':') : ['id', 'DESC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: models.User,
            attributes: ['id','firstname', 'lastname', 'photo']
        }]
    }).then(messages => {
        if(messages){
            res.status(200).json(messages);
        } else {
            res.status(404).json({ "erreur": "Aucun message trouvé"});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ "erreur": "Champs invalides"});
    });
};

exports.addLike = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtAuth.getUserId(headerAuth);
    const postId = req.params.id;
    console.log('body: ' + req.body.like);

    models.Message.findOne({ where: { id: messageId } })
        .then(message => {
            console.log(message.dataValues);
            message.update({
                like: req.body.like
            })
                .then(() => res.status(200).json({ message: 'Données mises à jour !' }))
                .catch((err) => res.status(500).json({ err }))
        })
        .catch(() => res.status(404).json({ error: 'Post introuvable !' }));
};