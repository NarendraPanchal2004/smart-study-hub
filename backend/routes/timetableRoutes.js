const express = require('express');
const router = express.Router();
const { getTimetable, addEvent, deleteEvent } = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTimetable);
router.post('/', protect, addEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
