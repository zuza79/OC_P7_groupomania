const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth')

router.post('/new', auth, commentCtrl.createComment);      //localhost:3000/api/comments/new
router.put('/:id', auth, commentCtrl.modifyComment);
router.delete('/:id', auth, commentCtrl.deleteComment)
router.get('/:postId', auth, commentCtrl.getPostComments)
router.get('/', auth, commentCtrl.getAllComments)       //localhost:3000/api/comments

module.exports = router;