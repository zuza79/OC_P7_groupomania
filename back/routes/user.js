const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const multerProfile = require('../middleware/multer-profile')
const auth = require('../middleware/auth')

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/:id', auth, multerProfile, userCtrl.delete);
router.get('/:id', auth, userCtrl.getOneUser);
router.put('/:id',auth, multerProfile, userCtrl.modifyUser);
//router.put('/admin/:id',auth, userCtrl.AdminModifyUser) à faire
router.get('/',auth, userCtrl.getAllUsers);
//router.put('/profile/:id',auth, userCtrl.modifyPassword) à faire

module.exports = router;
