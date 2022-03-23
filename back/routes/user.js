const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const multerProfile = require('../middleware/multer-profile')
const auth = require('../middleware/auth')

router.post('/signup', userCtrl.signup);  
router.post('/login', userCtrl.login);    
router.delete('/profile/:id', auth, multerProfile, userCtrl.deleteUser);  
router.get('/profile/:id', auth, userCtrl.getOneUser);  
router.put('/profile/:id',auth, multerProfile, userCtrl.modifyUser);  
router.get('/', auth, userCtrl.getAllUsers); 
router.put('/profile/:id', auth, userCtrl.modifyPassword); 

module.exports = router;
