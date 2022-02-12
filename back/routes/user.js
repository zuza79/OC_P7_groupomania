const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const multerProfile = require('../middleware/multer-profile')
const auth = require('../middleware/auth')

router.post('/signup', userCtrl.signup);  //ok
router.post('/login', userCtrl.login);    //ok
router.post('/login/admin', userCtrl.login); //login administrateur
router.delete('/profile/:id', auth, multerProfile, userCtrl.delete); // ok postman sans auth
router.get('/profile/:id', auth, userCtrl.getOneUser);  //ok postman localhost:3000/api/auth/profile/20
router.put('/profile/:id',auth, multerProfile, userCtrl.modifyUser); //erreur 
router.put('/admin/:id', auth, userCtrl.AdminModifyUser); // erreur ligne 257 user.update ...
router.get('/', auth, userCtrl.getAllUsers); // ok postman localhost:3000/api/auth
router.put('/profile/:id', auth, userCtrl.modifyPassword); //erreur 401

module.exports = router;
