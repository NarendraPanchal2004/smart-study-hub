const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', protect, upload.single('file'), (req, res) => {
  if (req.file) {
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.originalname });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

module.exports = router;
