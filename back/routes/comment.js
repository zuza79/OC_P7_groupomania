const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth')

//auth,
router.post('/',  commentCtrl.createComment);      //localhost:3000/api/comments
router.put('/:id', auth, commentCtrl.modifyComment);  //localhost:3000/api/comments/3
router.delete('/:id', auth, commentCtrl.deleteComment)
router.get('/:postId', commentCtrl.getPostComments)
router.get('/', commentCtrl.getAllComments)       //localhost:3000/api/comments

module.exports = router;