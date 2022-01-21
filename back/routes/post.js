// Création du router
const express = require('express');
const router = express.Router();


// Importation des middleware
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')


// Importation des controllers
const postCtrl = require('../controllers/post.js');


// Déclaration des routes post
router.post('/new', auth, multer, postCtrl.createPost);
router.get('/', auth, multer, postCtrl.getAllPost);
router.get('/:id', auth, multer, postCtrl.getUserPost);
router.put('/:id', auth, postCtrl.addLike);


// Exportation du router
module.exports = router;