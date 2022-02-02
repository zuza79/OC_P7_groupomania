const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const multerProfile = require('../middleware/multer-profile')
const auth = require('../middleware/auth')

router.post('/signup', multerProfile, userCtrl.signup);  //ok
router.post('/login',auth, multerProfile, userCtrl.login);   // problem code
router.delete('/profile/:id', auth, multerProfile, userCtrl.delete); // problem code
router.get('/profile/:id', auth, userCtrl.getOneUser);  //ok localhost:3000/api/auth/profile/2
router.put('/profile/:id',auth, multerProfile, userCtrl.modifyUser); //erreur ligne 213 user.update....
router.put('/admin/:id', auth, userCtrl.AdminModifyUser); // erreur ligne 257 user.update ...
router.get('/', auth, userCtrl.getAllUsers); // erreur
router.put('/profile/:id', auth, userCtrl.modifyPassword); //erreur 401

module.exports = router;
