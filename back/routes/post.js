const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const multerPosts = require('../middleware/multer-post')
const auth = require('../middleware/auth')

router.post('/new', auth,  multerPosts, postCtrl.createPost); //localhost:3000/api/posts/ PROBLEME IMAGE
router.put('/:id', auth, multerPosts, postCtrl.modifyPost);
router.delete('/:id',auth,multerPosts, postCtrl.deletePost) //OK all
router.get('/', auth, postCtrl.getAllPosts)                 //OK all
router.get('/:id', auth, postCtrl.getOnePost)               //OK all
router.get('/:userId/posts',auth, postCtrl.getPostsUser)
router.post('/:id/like', auth, postCtrl.like);


module.exports = router;