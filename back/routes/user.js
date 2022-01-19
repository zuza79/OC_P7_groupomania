// router
const express = require('express');
const router = express.Router();

// middleware
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')

// Import controllers
const userCtrl = require('../controllers/user');


// Déclaration des routes User
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.get('/profile/:id', auth, multer, userCtrl.getOneUser)
router.put('/profile/:id', auth, multer, userCtrl.updateUser)
router.delete('/profile/:id', auth, userCtrl.deleteUser)


// Exportation du router
module.exports = router;