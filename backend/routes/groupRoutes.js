const express = require('express');
const router = express.Router();
const { 
  createGroup, 
  joinGroup, 
  getUserGroups, 
  getGroupDetails 
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createGroup);
router.post('/join', protect, joinGroup);
router.get('/', protect, getUserGroups);
router.get('/:id', protect, getGroupDetails);

module.exports = router;
