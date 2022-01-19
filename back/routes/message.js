// Création du router
const express = require('express');
const router = express.Router();


// Importation des middleware
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')


// Importation des controllers
const messageCtrl = require('../controllers/message.js');


// Déclaration des routes message
router.post('/new', auth, multer, messageCtrl.createMessage);
router.get('/', auth, multer, messageCtrl.getAllMessage);
router.get('/:id', auth, multer, messageCtrl.getUserMessage);
router.put('/:id', auth, messageCtrl.addLike);


// Exportation du router
module.exports = router;