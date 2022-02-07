const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const multerPosts = require('../middleware/multer-post')
const auth = require('../middleware/auth')

router.post('/',  multerPosts, postCtrl.createPost); //localhost:3000/api/posts/
router.put('/:id', auth, multerPosts, postCtrl.modifyPost);
router.delete('/:id',auth,multerPosts, postCtrl.deletePost)
router.get('/', auth, postCtrl.getAllPosts)
router.get('/:id',  postCtrl.getOnePost) 
router.get('/:user_id/posts',auth, postCtrl.getPostsUser)
router.put('/admin/post/:id', auth, postCtrl.administrationPost)

module.exports = router;