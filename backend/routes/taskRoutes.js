const express = require('express');
const router = express.Router();
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTasks);
router.post('/', protect, addTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
