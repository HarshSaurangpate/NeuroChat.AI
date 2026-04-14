const express = require('express');
const router = express.Router();
const { getThreads, createThread, deleteThread, renameThread } = require('../controllers/threadController');
const { protect } = require('../middleware/auth');

router.use(protect); // All thread routes require authentication

router.get('/', getThreads);
router.post('/', createThread);
router.delete('/:id', deleteThread);
router.patch('/:id', renameThread);

module.exports = router;
