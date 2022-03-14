const express = require('express');
const router = express.Router();

const likeCtrl = require('../controllers/likes');
const auth = require('../middleware/auth')

router.post( '/posts/:postId/vote/like', auth, likeCtrl.likePost);

module.exports = router;