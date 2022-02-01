const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const multerProfile = require('../middleware/multer-profile')
const auth = require('../middleware/auth')

router.post('/signup', multerProfile, userCtrl.signup);
router.post('/login', multerProfile, userCtrl.login);
//router.delete('/profile/:id', auth, multerProfile, userCtrl.delete);
router.get('/profile/:id', auth, userCtrl.getOneUser);
router.put('/profile/:id',auth, multerProfile, userCtrl.modifyUser);
//router.put('/admin/:id',auth, userCtrl.AdminModifyUser) à faire
router.get('/',auth, userCtrl.getAllUsers);
//router.put('/profile/:id',auth, userCtrl.modifyPassword) à faire

module.exports = router;
