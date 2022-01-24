const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const multerPosts = require('../middleware/multer-post')
const auth = require('../middleware/auth')

router.post('/', auth, multerPosts, postCtrl.createPost);
router.put('/:id', auth, multerPosts, postCtrl.modifyPost);
router.delete('/:id',auth,multerPosts, postCtrl.deletePost)
router.get('/', auth, postCtrl.getAllPosts)
router.get('/:id', auth, postCtrl.getOnePost)
router.get('/:user_id/posts',auth, postCtrl.getPostsUser)
router.put('/moderate/:id', auth, postCtrl.moderatePost)

module.exports = router;