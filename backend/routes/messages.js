const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect); // All message routes require authentication

router.get('/:threadId', getMessages);
router.post('/', sendMessage);

module.exports = router;
