const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const upload = require('../config/multer');

// Route for audio analysis
router.post('/analyze', upload.single('audio'), audioController.analyzeAudio);

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Audio analysis service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;