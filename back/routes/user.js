const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const multerProfile = require('../middleware/multer-profile')
const auth = require('../middleware/auth')

router.post('/signup', userCtrl.signup);  //ok
router.post('/login', userCtrl.login);    //ok
router.delete('/profile/:id', auth, multerProfile, userCtrl.delete); // ok postman sans auth
router.get('/profile/:id', userCtrl.getOneUser);  //ok postman sans auth  localhost:3000/api/auth/profile/2
router.put('/profile/:id',auth, multerProfile, userCtrl.modifyUser); //erreur ligne 213 user.update....
router.put('/admin/:id', auth, userCtrl.AdminModifyUser); // erreur ligne 257 user.update ...
router.get('/', userCtrl.getAllUsers); // ok postman sans auth localhost:3000/api/auth
router.put('/profile/:id', auth, userCtrl.modifyPassword); //erreur 401

module.exports = router;
