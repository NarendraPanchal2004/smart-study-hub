const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:groupId', protect, getMessages);
router.post('/', protect, sendMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
