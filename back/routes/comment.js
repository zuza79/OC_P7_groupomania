const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth')

router.post('/', auth, commentCtrl.createComment);      //localhost:3000/api/comments
router.put('/:id', auth, commentCtrl.modifyComment);
router.delete('/:id', auth, commentCtrl.deleteComment)
router.get('/:post_id', auth, commentCtrl.getPostComments)
router.get('/', auth, commentCtrl.getAllComments)

module.exports = router;