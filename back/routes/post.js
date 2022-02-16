const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const multerPosts = require('../middleware/multer-post')
const auth = require('../middleware/auth')

router.post('/add', auth,  multerPosts, postCtrl.createPost); //localhost:3000/api/posts/ postman OK
router.put('/:id', auth, multerPosts, postCtrl.modifyPost);
router.delete('/:id',auth,multerPosts, postCtrl.deletePost) //od postman
router.get('/', auth, postCtrl.getAllPosts)
router.get('/:id', auth, postCtrl.getOnePost) 
router.get('/:userId/posts',auth, postCtrl.getPostsUser)
router.put('/admin/post/:id', auth, postCtrl.administrationPost)

module.exports = router;