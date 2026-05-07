const express = require('express');
const router = express.Router();
const { getBooks, addBook } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getBooks);
router.post('/', protect, addBook);

module.exports = router;
